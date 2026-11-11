// The opening repertoire for the Openings tab, picked from the openings this account plays most.
// Each line is SAN from the start position. You play `color`; the other side's moves are the branches
// the trainer picks from. A position must always get the same move from you, in every line of the same
// opening, so the trainer has one right answer. tools/check-openings.mjs checks that, checks every move
// is legal and has Stockfish score your moves.
export const OPENINGS = [
  {
    id: 'caro-kann', name: 'Caro-Kann Defence', color: 'b',
    blurb: '1.e4 c6 2.d4 d5, meeting the Advance with 3...c5 as you do in your games. Against the Advance, the Classical, the Exchange, the Panov, the Two Knights and the sidelines.',
    lines: [
      { name: 'Advance 3...c5, 4.c3', moves: 'e4 c6 d4 d5 e5 c5 c3 Nc6 Nf3 cxd4 cxd4 Bg4 Be2 e6 O-O Nge7' },
      { name: 'Advance 3...c5, 4.c3 5.Bb5', moves: 'e4 c6 d4 d5 e5 c5 c3 Nc6 Bb5 Qb6 Bxc6+ bxc6' },
      { name: 'Advance 3...c5, 4.dxc5', moves: 'e4 c6 d4 d5 e5 c5 dxc5 Nc6 Nf3 Bg4 Bb5 Qa5+ Nc3 e6' },
      { name: 'Advance 3...c5, 4.dxc5 5.Bb5', moves: 'e4 c6 d4 d5 e5 c5 dxc5 Nc6 Bb5 e6 Be3 Ne7' },
      { name: 'Advance 3...c5, 4.Nf3', moves: 'e4 c6 d4 d5 e5 c5 Nf3 Bg4 Be2 Nc6 dxc5 e6' },
      { name: 'Advance 3...c5, 4.Bb5+', moves: 'e4 c6 d4 d5 e5 c5 Bb5+ Bd7 Bxd7+ Qxd7 dxc5 e6' },
      { name: 'Classical, 6.h4', moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6 Bd2 Ngf6 O-O-O Be7' },
      { name: 'Classical, 6.Nf3', moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 Nf3 Nd7 Bd3 Bxd3 Qxd3 e6 O-O Ngf6' },
      { name: 'Classical via 3.Nd2', moves: 'e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7' },
      { name: 'Exchange', moves: 'e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4 Qb3 Qd7 Nd2 e6 Ngf3 Bxf3 Nxf3 Bd6 Bxd6 Qxd6 O-O O-O' },
      { name: 'Panov', moves: 'e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Bb4 cxd5 Nxd5 Bd2 Nc6 Bd3 O-O O-O Be7' },
      { name: 'Two Knights, 6.d4', moves: 'e4 c6 Nc3 d5 Nf3 Bg4 h3 Bxf3 Qxf3 e6 d4 Nf6 Bd3 dxe4 Nxe4 Qxd4 c3 Qd8' },
      { name: 'Two Knights, 6.d3', moves: 'e4 c6 Nc3 d5 Nf3 Bg4 h3 Bxf3 Qxf3 e6 d3 Nd7 Bd2 Ngf6' },
      { name: 'Fantasy', moves: 'e4 c6 d4 d5 f3 e6 Nc3 Bb4 Bd2 dxe4 fxe4 Bxc3 Bxc3 Qh4+ g3 Qxe4+' },
      { name: '2.c4', moves: 'e4 c6 c4 d5 exd5 cxd5 cxd5 Nf6 Nc3 Nxd5 Nf3 Nc6' },
      { name: "King's Indian Attack", moves: 'e4 c6 d3 d5 Nd2 e5 Ngf3 Bd6 g3 Nf6 Bg2 O-O O-O Re8' },
    ],
  },
  {
    id: 'slav', name: 'Slav Defence', color: 'b',
    blurb: '1.d4 d5 2.c4 c6, the Caro-Kann idea against 1.d4, plus the London.',
    lines: [
      { name: 'Main line, 5.a4', moves: 'd4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O Nbd7' },
      { name: '4.e3', moves: 'd4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Nc3 e6 Nh4 Bg6 Nxg6 hxg6' },
      { name: 'Exchange', moves: 'd4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6 Bf4 Nc6 e3 Bf5 Nf3 e6' },
      { name: '3.Nc3, Meran', moves: 'd4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bb7' },
      { name: '2.Nf3 3.c4', moves: 'd4 d5 Nf3 Nf6 c4 c6 Nc3 dxc4' },
      { name: 'London', moves: 'd4 d5 Bf4 Nf6 e3 c5 c3 Nc6 Nd2 e6 Ngf3 Bd6' },
      { name: 'London via 2.Nf3', moves: 'd4 d5 Nf3 Nf6 Bf4 c5 e3 Nc6' },
    ],
  },
  {
    id: 'scotch', name: 'Scotch Game', color: 'w',
    blurb: '1.e4 e5 2.Nf3 Nc6 3.d4. Against 4...Nf6, 4...Bc5, 4...Qh4 and the rest.',
    lines: [
      { name: 'Mieses, 7...Ba6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Ba6 b3' },
      { name: 'Mieses, 7...Nb6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Nb6 Nd2' },
      { name: 'Classical, 5.Nxc6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nxc6 Qf6 Qd2 dxc6 Nc3 Be6 Na4' },
      { name: 'Steinitz, 4...Qh4', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3 Bb4 Be2 Qxe4 Nb5' },
      { name: '4...Nxd4', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nxd4 Qxd4 Ne7 Bc4 Nc6 Qd5' },
      { name: '3...d6', moves: 'e4 e5 Nf3 Nc6 d4 d6 Bb5 Bd7 Nc3 exd4 Nxd4' },
      { name: '3...exd4 4.Nxd4 d6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 d6 Nc3 Nf6 Be2 Be7 O-O O-O' },
    ],
  },
  {
    id: 'italian', name: 'Italian Game', color: 'w',
    blurb: '1.e4 e5 2.Nf3 Nc6 3.Bc4, the slow c3 and d3 plan, plus 3...Be7, 3...d6 and the 3...Nd4 trap.',
    lines: [
      { name: 'Giuoco Pianissimo', moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Nbd2 a6 a4 Ba7 h3 h6 Re1 Re8' },
      { name: 'Giuoco Pianissimo, ...d5', moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 O-O O-O d5 exd5 Nxd5 Re1' },
      { name: 'Giuoco Pianissimo, ...a6', moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 a6 O-O d6 a4 Ba7 Re1 O-O h3 h6 Nbd2 Re8' },
      { name: 'Two Knights, 4.d3', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 O-O O-O Re1 d6 c3 Na5 Bb5 a6 Ba4 b5 Bc2 c5 Nbd2' },
      { name: 'Two Knights, 4...Bc5', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 c3 d6 O-O O-O Nbd2 a6 a4 Ba7 h3 h6 Re1 Re8' },
      { name: 'Hungarian, 4...exd4', moves: 'e4 e5 Nf3 Nc6 Bc4 Be7 d4 exd4 Nxd4 Nf6 Nc3 O-O O-O' },
      { name: 'Hungarian, 4...d6', moves: 'e4 e5 Nf3 Nc6 Bc4 Be7 d4 d6 d5 Nb8 Bd3 Nf6 c4' },
      { name: '3...d6, 4...Bg4', moves: 'e4 e5 Nf3 Nc6 Bc4 d6 d4 Bg4 h3 Bxf3 Qxf3 Nf6 d5 Nd4 Qd3' },
      { name: '3...d6, 4...exd4', moves: 'e4 e5 Nf3 Nc6 Bc4 d6 d4 exd4 Nxd4 Nf6 Nc3 Be7 O-O O-O' },
      { name: 'Blackburne Shilling trap', moves: 'e4 e5 Nf3 Nc6 Bc4 Nd4 Nxd4 exd4 O-O' },
    ],
  },
  {
    id: 'petrov-philidor', name: 'Against the Petrov and Philidor', color: 'w',
    blurb: '1.e4 e5 2.Nf3, when Black skips 2...Nc6: the Petrov with 3.d4 and the Philidor with 3.d4.',
    lines: [
      { name: 'Petrov, 3...Nxe4', moves: 'e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 d5 Nxe5 Nd7 Nxd7 Bxd7 O-O Bd6 c4 c6 Nc3 Nxc3 bxc3 dxc4 Re1+' },
      { name: 'Petrov, 3...exd4', moves: 'e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4 Qxd4 d5 exd6 Nxd6 Bd3' },
      { name: 'Philidor, 3...exd4', moves: 'e4 e5 Nf3 d6 d4 exd4 Nxd4 Nf6 Nc3 Be7 Be2 O-O O-O Re8' },
      { name: 'Philidor, 3...Nf6', moves: 'e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7 Bc4 Be7 O-O O-O Re1' },
      { name: 'Philidor, Morphy line', moves: 'e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Qxb7 Qb4+ Qxb4 Bxb4+ c3' },
    ],
  },
  {
    id: 'alapin', name: 'Alapin against the Sicilian', color: 'w',
    blurb: '1.e4 c5 2.c3, aiming for a big centre with d4.',
    lines: [
      { name: '2...d5', moves: 'e4 c5 c3 d5 exd5 Qxd5 d4 Nf6 Nf3 Bg4 Be2 e6 O-O Nc6 Be3 cxd4 cxd4' },
      { name: '2...Nf6', moves: 'e4 c5 c3 Nf6 e5 Nd5 d4 cxd4 Nf3 Nc6 cxd4 d6 Bc4 Nb6 Bb5' },
      { name: '2...e6', moves: 'e4 c5 c3 e6 d4 d5 e5 Nc6 Nf3' },
      { name: '2...Nc6', moves: 'e4 c5 c3 Nc6 d4 cxd4 cxd4 d5 exd5 Qxd5 Nf3' },
      { name: '2...d6', moves: 'e4 c5 c3 d6 d4 Nf6 Bd3 Nc6 Nf3' },
      { name: '2...g6', moves: 'e4 c5 c3 g6 d4 cxd4 cxd4 d5 e5 Nc6 Nc3' },
      { name: '2...e5', moves: 'e4 c5 c3 e5 Nf3 Nc6 Bc4' },
    ],
  },
  {
    id: 'vs-scandinavian', name: 'Against the Scandinavian', color: 'w',
    blurb: '1.e4 d5 2.exd5, with Nc3 to gain time on the queen.',
    lines: [
      { name: '3...Qa5', moves: 'e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 c6 Bc4 Bf5 Bd2 e6 Qe2' },
      { name: '3...Qa5 4...c6', moves: 'e4 d5 exd5 Qxd5 Nc3 Qa5 d4 c6 Nf3 Bf5 Bc4' },
      { name: '3...Qd6', moves: 'e4 d5 exd5 Qxd5 Nc3 Qd6 d4 Nf6 Nf3 a6 g3' },
      { name: '3...Qd8', moves: 'e4 d5 exd5 Qxd5 Nc3 Qd8 d4 Nf6 Nf3 Bg4 h3 Bxf3 Qxf3 c6 Be3' },
      { name: '2...Nf6', moves: 'e4 d5 exd5 Nf6 d4 Nxd5 Nf3 Bg4 Be2 e6 O-O Nc6 c4 Nb6 Nc3' },
      { name: 'Portuguese', moves: 'e4 d5 exd5 Nf6 d4 Bg4 f3 Bf5 c4' },
    ],
  },
  {
    id: 'vs-french', name: 'Advance against the French', color: 'w',
    blurb: '1.e4 e6 2.d4 d5 3.e5, holding the e5 pawn with c3 and Nf3.',
    lines: [
      { name: '5...Qb6', moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 c4 Nbd2 Na5 Rb1' },
      { name: '5...Bd7', moves: 'e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7 Be2 Nge7 O-O Ng6 g3' },
      { name: '4...Qb6', moves: 'e4 e6 d4 d5 e5 c5 c3 Qb6 Nf3 Bd7 Be2 Bb5 O-O' },
      { name: '3...Bd7', moves: 'e4 e6 d4 d5 e5 Bd7 Nf3 c5 c3' },
    ],
  },
];
