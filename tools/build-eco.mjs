// Builds ../eco.json from lichess-org/chess-openings (CC0).
// Key: first three FEN fields (placement, side to move, castling). Value: [eco, name].
// Run: npm install && npm run eco
import { Chess } from 'chess.js';
import { writeFileSync } from 'node:fs';

const BASE = 'https://cdn.jsdelivr.net/gh/lichess-org/chess-openings@master/';
const key = (fen) => fen.split(' ').slice(0, 3).join(' ');
const out = {};
let rows = 0;

for (const f of ['a', 'b', 'c', 'd', 'e']) {
  const tsv = await (await fetch(BASE + f + '.tsv')).text();
  for (const line of tsv.split('\n').slice(1)) {
    if (!line.trim()) continue;
    const [eco, name, pgn] = line.split('\t');
    const c = new Chess();
    c.loadPgn(pgn);
    out[key(c.fen())] = [eco, name];
    rows++;
  }
}

writeFileSync(new URL('../eco.json', import.meta.url), JSON.stringify(out));
console.log(`${rows} lines, ${Object.keys(out).length} positions`);
