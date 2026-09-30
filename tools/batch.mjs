#!/usr/bin/env node
// Offline analysis of Chess.com months. Writes data/<user>/<yyyy-mm>.json, which
// index.html imports into its cache when that month is loaded.
//
//   node tools/batch.mjs --user NAME [--month 2024-01 ...] [--last 1] [--depth 18]
//                        [--procs N] [--engine /path/to/stockfish] [--force]
//
// Uses a native `stockfish` from PATH when there is one (brew install stockfish),
// otherwise downloads the same Stockfish 17.1 lite wasm build the page uses and runs it under Node.
import { Chess } from 'chess.js';
import { readGame, Uci } from '../core.mjs';
import { spawn, spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const HERE = dirname(fileURLToPath(import.meta.url));
const SF_BASE = 'https://unpkg.com/stockfish@17.1.0/src/stockfish-17.1-lite-single-03e3232';
const UA = 'chess-analyser batch (personal use)';

const { values: opt } = parseArgs({
  options: {
    user: { type: 'string' },
    month: { type: 'string', multiple: true },
    last: { type: 'string', default: '1' },
    depth: { type: 'string', default: '18' },
    procs: { type: 'string' },
    engine: { type: 'string' },
    out: { type: 'string', default: join(HERE, '..', 'data') },
    force: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h' },
  },
});

if (opt.help || !opt.user) {
  console.log('usage: node tools/batch.mjs --user NAME [--month YYYY-MM ...] [--last N] [--depth 18] [--procs N] [--engine PATH] [--force]');
  process.exit(opt.help ? 0 : 1);
}

const user = opt.user.toLowerCase();
const depth = +opt.depth;
const procs = +(opt.procs || Math.max(1, availableParallelism() - 1));

async function api(path) {
  const r = await fetch('https://api.chess.com/pub/' + path, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`Chess.com API ${r.status} for ${path}`);
  return r.json();
}

async function engineCommand() {
  if (opt.engine) return [opt.engine, []];
  if (spawnSync('sh', ['-c', 'command -v stockfish']).status === 0) return ['stockfish', []];
  const dir = join(HERE, '.engine');
  // .cjs keeps Node from treating the loader as ESM; it finds the .wasm by its own basename.
  const js = join(dir, 'stockfish-17.1-lite-single-03e3232.cjs');
  const wasm = join(dir, 'stockfish-17.1-lite-single-03e3232.wasm');
  if (!existsSync(js) || !existsSync(wasm)) {
    console.log('No native stockfish on PATH, downloading the wasm build (7 MB) to tools/.engine/');
    mkdirSync(dir, { recursive: true });
    for (const [url, file] of [[SF_BASE + '.js', js], [SF_BASE + '.wasm', wasm]]) {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`download failed: ${url} ${r.status}`);
      writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    }
  }
  return [process.execPath, [js]];
}

// One engine process speaking UCI over stdin/stdout.
function processEngine(cmd, args) {
  const p = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'ignore'] });
  const failed = new Promise((_, rej) => {
    p.on('error', rej);
    p.on('exit', (code) => rej(new Error(`engine exited with code ${code}`)));
  });
  const uci = new Uci((line) => p.stdin.write(line + '\n'), failed, ['setoption name Threads value 1', 'setoption name Hash value 64']);
  createInterface({ input: p.stdout }).on('line', (l) => uci.onLine(l.trim()));
  uci.quit = () => p.stdin.write('quit\n');
  return uci;
}

async function analyseGame({ fens, terminal }, engines) {
  const ev = new Array(fens.length).fill(null);
  const todo = [...fens.keys()];
  if (terminal != null) { ev[fens.length - 1] = [terminal, '']; todo.pop(); }
  await Promise.all(engines.map(async (e) => {
    for (let i; (i = todo.shift()) !== undefined;) ev[i] = await e.analyse(fens[i], depth);
  }));
  return ev;
}

function writeAtomic(file, data) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file + '.tmp', JSON.stringify(data));
  renameSync(file + '.tmp', file);
}

const archives = (await api(`player/${encodeURIComponent(user)}/games/archives`)).archives.map((u) => u.slice(-7).replace('/', '-'));
const months = opt.month?.length ? opt.month : archives.slice(-Math.max(1, +opt.last));
if (!months.length) { console.log(`${user} has no games`); process.exit(0); }

const [cmd, args] = await engineCommand();
const engines = await Promise.all(Array.from({ length: procs }, async () => { const e = processEngine(cmd, args); await e.ready; return e; }));
const engineName = engines[0].name;
console.log(`${engineName}, ${procs} process${procs > 1 ? 'es' : ''}, depth ${depth}`);

for (const ym of months) {
  const file = join(opt.out, user, ym + '.json');
  const out = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { user, month: ym, games: {} };
  const [y, m] = ym.split('-');
  const games = (await api(`player/${encodeURIComponent(user)}/games/${y}/${m}`)).games.filter((g) => g.rules === 'chess');
  const todo = games.filter((g) => opt.force || !out.games[g.url] || out.games[g.url].d < depth);
  console.log(`${ym}: ${games.length} games, ${todo.length} to analyse`);
  for (const [k, g] of todo.entries()) {
    let pos;
    try { pos = readGame(Chess, g.pgn); } catch { console.log(`  skip ${g.url}: PGN did not parse`); continue; }
    const t0 = Date.now();
    const ev = await analyseGame(pos, engines);
    out.games[g.url] = { v: 1, d: depth, e: engineName, t: Date.now(), ev };
    Object.assign(out, { engine: engineName, depth, generated: new Date().toISOString() });
    writeAtomic(file, out);
    console.log(`  ${k + 1}/${todo.length} ${g.url} ${pos.fens.length} positions in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
}

engines.forEach((e) => e.quit());
