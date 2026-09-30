// Prototype: tag each of your mistakes and blunders with what went wrong, then count the tags.
// node tools/patterns-proto.mjs manevanebgx 2026-05
import { Chess } from 'chess.js';
import { readFileSync } from 'node:fs';
import { readGame, MATE } from '../core.mjs';

const [user, ym] = process.argv.slice(2);
const saved = JSON.parse(readFileSync(new URL(`../data/${user}/${ym}.json`, import.meta.url))).games;
const res = await fetch(`https://api.chess.com/pub/player/${user}/games/${ym.replace('-', '/')}`, { headers: { 'User-Agent': 'chess-analyser' } });
const games = (await res.json()).games.filter((g) => saved[g.url]);

const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const clamp = (s) => Math.max(-1000, Math.min(1000, s));
const isMate = (s) => Math.abs(s) > MATE - 1000;
const winPct = (cp) => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);

function play(fen, pv) {
  const c = new Chess(fen), moves = [];
  for (const u of (pv || '').split(' ').filter(Boolean)) {
    try { moves.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); } catch { break; }
  }
  return { c, moves };
}
// Material the side to move nets once the other side has replied.
function net(fen, pv) {
  const side = fen.split(' ')[1];
  let n = 0, settled = 0;
  for (const m of play(fen, pv).moves) {
    const v = (m.captured ? VAL[m.captured] : 0) + (m.promotion ? VAL[m.promotion] - 1 : 0);
    n += m.color === side ? v : -v;
    if (m.color !== side) settled = n;
  }
  return settled;
}
const clockSecs = (c) => { const m = c?.match(/(\d+):(\d+):([\d.]+)/); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : null; };

const tags = {}, examples = {};
let errors = 0, myMoves = 0;
const tag = (t, ex) => { tags[t] = (tags[t] || 0) + 1; (examples[t] ||= []).push(ex); };

for (const raw of games) {
  const { moves, fens, comments } = readGame(Chess, raw.pgn);
  const ev = saved[raw.url].ev;
  if (ev.length !== fens.length) continue;
  const me = raw.white.username.toLowerCase() === user.toLowerCase() ? 'w' : 'b';
  const base = +String(raw.time_control).split('+')[0];
  moves.forEach((m, i) => {
    if (m.color !== me) return;
    myMoves++;
    const pov = (s) => clamp(me === 'w' ? s : -s);
    const before = pov(ev[i][0]), after = pov(ev[i + 1][0]), loss = before - after;
    if (loss < 100 || before < -300 || winPct(before) - winPct(after) < 8 || i < 8) return;
    errors++;
    const ex = `${raw.url} move ${m.before.split(' ')[5]}${me === 'w' ? '.' : '…'} ${m.san}`;
    const reply = ev[i + 1][1], best = ev[i][1];
    const lost = net(fens[i + 1], reply);          // opponent's gain after your move
    const missed = net(fens[i], best);             // what the best line would have won you
    if (isMate(ev[i + 1][0]) && after < 0) tag('walked into a mating attack', ex);
    else if (lost >= 3) tag('left a piece to be taken', ex);
    else if (lost >= 1) tag('dropped a pawn', ex);
    if (isMate(ev[i][0]) && before > 0 && !(isMate(ev[i + 1][0]) && after > 0)) tag('missed a mate', ex);
    else if (missed >= 3) tag('missed winning a piece', ex);
    // Fork: the punishing reply attacks two or more of your pieces worth a knight or more (or the king).
    const r = play(fens[i + 1], reply.split(' ')[0]);
    const hit = r.moves[0];
    if (hit) {
      const targets = r.c.board().flat().filter((p) => p && p.color === me && (VAL[p.type] >= 3 || p.type === 'k'))
        .filter((p) => r.c.attackers(p.square, hit.color).includes(hit.to));
      if (targets.length >= 2) tag(`walked into a ${hit.piece === 'n' ? 'knight ' : ''}fork`, ex);
      if (hit.san.includes('+')) tag('allowed a check that wins something', ex);
    }
    if (before >= 300 && after < 150) tag('threw away a winning position', ex);
    const clk = clockSecs(comments.get(m.after));
    if (clk != null && base && (clk < 30 || clk < base * 0.1)) tag('under time pressure', ex);
    const phase = i < 20 ? 'opening' : new Chess(fens[i]).board().flat().filter((p) => p && p.type !== 'p' && p.type !== 'k').length <= 6 ? 'endgame' : 'middlegame';
    tag(`in the ${phase}`, ex);
    tag(`moved the ${{ p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }[m.piece]}`, ex);
  });
}

console.log(`${games.length} games, ${myMoves} of your moves, ${errors} mistakes or blunders (${(errors / games.length).toFixed(1)} per game)\n`);
for (const [t, n] of Object.entries(tags).sort((a, b) => b[1] - a[1])) {
  console.log(`${String(n).padStart(4)}  ${String(Math.round((n / errors) * 100)).padStart(3)}%  ${t}`);
}
console.log('\ne.g. left a piece:', examples['left a piece to be taken']?.slice(0, 2).join(' | '));
