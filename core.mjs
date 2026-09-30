// Shared by index.html and tools/batch.mjs, so the page and the batch job agree on positions and scores.
// Anything that shapes a stored analysis lives here: if the two sides disagreed on the number of
// positions, the page would throw away every batch result as mismatched.

export const MATE = 30000; // mate in n is stored as ±(MATE - n), always from white's point of view
const PV_LEN = 5;          // engine line length kept per position

// Score of a finished position (mate or dead draw), or null when the engine has to judge it.
// Engines report no usable score for these, so they are never sent to one.
export function terminalScore(c) {
  if (c.isCheckmate()) return c.turn() === 'w' ? -MATE : MATE;
  return c.isStalemate() || c.isInsufficientMaterial() ? 0 : null;
}

// Every position of a PGN, plus the score of the final one if the game ended on the board.
export function readGame(Chess, pgn) {
  const c = new Chess();
  c.loadPgn(pgn);
  const moves = c.history({ verbose: true });
  const fens = [moves.length ? moves[0].before : c.fen(), ...moves.map((m) => m.after)];
  const terminal = terminalScore(new Chess(fens.at(-1)));
  return { moves, fens, terminal, comments: new Map(c.getComments().map((x) => [x.fen, x.comment])) };
}

// Speaks UCI over any transport. `post` sends one command, `failed` rejects when the engine dies,
// and the owner feeds each line of engine output to onLine().
export class Uci {
  constructor(post, failed, options = []) {
    this.post = post;
    this.failed = failed;
    failed.catch(() => {});
    this.name = 'Stockfish';
    this.isReady = false;
    this.wait = null;
    this.info = null;
    this.ready = this.send('uci', (l) => l === 'uciok')
      .then(() => { options.forEach(post); return this.send('isready', (l) => l === 'readyok'); })
      .then(() => { this.isReady = true; });
  }

  onLine(line) {
    if (line.startsWith('id name ')) this.name = line.slice(8);
    if (this.info && line.startsWith('info ')) this.info(line);
    if (this.wait && this.wait.test(line)) { const w = this.wait; this.wait = null; w.resolve(line); }
  }

  send(cmd, test) {
    return Promise.race([new Promise((resolve) => { this.wait = { test, resolve }; this.post(cmd); }), this.failed]);
  }

  // Returns [score from white's point of view, "principal variation in uci"]. Stored analyses keep
  // PV_LEN moves; a caller that needs the whole line (a mating sequence) asks for more.
  async analyse(fen, depth, pvLen = PV_LEN) {
    await this.ready;
    let last = null;
    this.info = (l) => { if (l.includes(' pv ') && !/ (lower|upper)bound /.test(l) && !/ multipv [2-9]/.test(l)) last = l; };
    this.post('position fen ' + fen);
    const bestLine = await this.send('go depth ' + depth, (l) => l.startsWith('bestmove'));
    this.info = null;

    const best = bestLine.split(' ')[1];
    let s = 0, pv = [];
    if (last) {
      const t = last.split(' ');
      const k = t.indexOf('score');
      const v = +t[k + 2];
      s = t[k + 1] === 'mate' ? (v > 0 ? MATE - v : -MATE - v) : v;
      const p = t.indexOf('pv');
      if (p > 0) pv = t.slice(p + 1, p + 1 + pvLen);
    }
    if (best && best !== '(none)' && pv[0] !== best) pv = [best];
    return [fen.split(' ')[1] === 'w' ? s : -s, pv.join(' ')];
  }
}
