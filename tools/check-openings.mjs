// Checks the repertoire in ../openings.mjs: every move legal, one answer per position for the side you
// play, and Stockfish's opinion of each of your moves. Then checks Stockfish agrees with the goal of
// each drill in ../endgames.mjs.
// Usage: node check-openings.mjs [--depth 18] [--slip 75]. The lite engine's scores swing by about 0.3
// between runs, so --slip sits above that.
import { Chess } from 'chess.js';
import { spawn, spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { Uci } from '../core.mjs';
import { OPENINGS } from '../openings.mjs';
import { ENDGAMES } from '../endgames.mjs';

const { values: opt } = parseArgs({ options: { depth: { type: 'string', default: '18' }, slip: { type: 'string', default: '75' } } });
const depth = +opt.depth, slip = +opt.slip;
const HERE = dirname(fileURLToPath(import.meta.url));
const key = (fen) => fen.split(' ').slice(0, 4).join(' ');

function engine() {
  const js = join(HERE, '.engine', 'stockfish-17.1-lite-single-03e3232.cjs');
  const [cmd, args] = spawnSync('sh', ['-c', 'command -v stockfish']).status === 0 ? ['stockfish', []]
    : existsSync(js) ? [process.execPath, [js]] : (() => { throw new Error('No engine: run batch.mjs once to download it'); })();
  const p = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'ignore'] });
  const failed = new Promise((_, rej) => p.on('exit', (c) => rej(new Error(`engine exited ${c}`))));
  const uci = new Uci((l) => p.stdin.write(l + '\n'), failed, ['setoption name Threads value 1', 'setoption name Hash value 64']);
  createInterface({ input: p.stdout }).on('line', (l) => uci.onLine(l.trim()));
  uci.quit = () => p.kill();
  return uci;
}

let problems = 0;
const fail = (msg) => { problems++; console.log('  ✗ ' + msg); };
const e = engine();
const cache = new Map();
const score = async (fen) => {
  const c = new Chess(fen);
  if (c.isCheckmate()) return c.turn() === 'w' ? -30000 : 30000;
  if (!cache.has(fen)) cache.set(fen, await e.analyse(fen, depth));
  return cache.get(fen)[0];
};

for (const o of OPENINGS) {
  console.log(`${o.name} (${o.color === 'w' ? 'White' : 'Black'}), ${o.lines.length} lines`);
  const mine = new Map(); // position -> the move you play there
  for (const l of o.lines) {
    const c = new Chess();
    for (const san of l.moves.split(' ')) {
      const before = c.fen();
      let m;
      try { m = c.move(san); } catch { fail(`${l.name}: illegal ${san} after ${c.history().join(' ')}`); break; }
      if (m.san !== san) fail(`${l.name}: write ${san} as ${m.san}`);
      if (m.color !== o.color) continue;
      const k = key(before), had = mine.get(k);
      if (had && had !== m.san) fail(`${l.name}: plays ${m.san} where another line plays ${had} (after ${c.history().slice(0, -1).join(' ')})`);
      mine.set(k, m.san);
    }
  }
  // Engine check, once per position you move in.
  for (const [k, san] of mine) {
    const fen = k + ' 0 1', c = new Chess(fen);
    const [best, pv] = await e.analyse(fen, depth);
    c.move(san);
    const after = await score(c.fen());
    const pov = o.color === 'w' ? 1 : -1, loss = (best - after) * pov;
    if (loss > slip) {
      const b = new Chess(fen), bestSan = b.move({ from: pv.slice(0, 2), to: pv.slice(2, 4), promotion: pv[4] }).san;
      fail(`${san} loses ${loss} cp (best ${bestSan}, ${best} vs ${after}) in ${k}`);
    }
  }
  // Where each line ends.
  for (const l of o.lines) {
    const c = new Chess();
    try { l.moves.split(' ').forEach((s) => c.move(s)); } catch { continue; }
    const s = await score(c.fen());
    console.log(`  ${l.name}: ends ${(s / 100).toFixed(2)}`);
  }
}
console.log(`Endgames, ${ENDGAMES.length} drills`);
for (const d of ENDGAMES) {
  let c;
  try { c = new Chess(d.fen); } catch (err) { fail(`${d.name}: bad FEN (${err.message})`); continue; }
  const [s] = await e.analyse(d.fen, depth + 6), pov = c.turn() === 'w' ? s : -s;
  const ok = d.goal === 'win' ? pov >= 200 : Math.abs(pov) < 100;
  if (ok) console.log(`  ${d.name}: ${(pov / 100).toFixed(2)} for you`);
  else fail(`${d.name}: engine says ${(pov / 100).toFixed(2)} for you, goal is ${d.goal}`);
}
e.quit();
console.log(problems ? `${problems} problem(s)` : 'All good');
process.exit(problems ? 1 : 0);
