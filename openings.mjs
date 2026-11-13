// The opening repertoire for the Openings tab, picked from the openings this account plays most.
// Each line is SAN from the start position. You play `color`; the other side's moves are the branches
// the trainer picks from. A position must always get the same move from you, in every line of the same
// opening, so the trainer has one right answer. tools/check-openings.mjs checks that, checks every move
// is legal and has Stockfish score your moves.
// `ideas` are the plans and traps shown on the opening's page. A line's `notes` are keyed by move, like
// "6.Bxf7+" or "5...dxc3", and show in the trainer once that move is on the board. `trap` lines follow
// an opponent's mistake so you learn the punishment.
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
    ideas: [
      'You open the centre on move 3 and put a knight on d4. Black has no Ruy Lopez or Italian structure to hide behind.',
      'Against 4...Nf6, take on c6 and push e5 (the Mieses). The e5 pawn cramps Black, and c4 drives the knight off d5.',
      'Trap: after 4...Qh4 5.Nc3, the e4 pawn looks free. 5...Qxe4+?? 6.Nxe4 wins the queen.',
      'Trap: after 4...Bc5 5.Nxc6, the f2 pawn looks weak. 5...Bxf2+?? 6.Kxf2 and 6...Qxf2+?? (after 5...Qf6 6.Qd2) both drop a piece.',
      'In the Mieses, meet 8...Qb4+ with 9.Nd2. 9.Bd2? Qxb2 wins a pawn and hits your rook.',
    ],
    lines: [
      {
        name: 'Mieses, 7...Ba6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Ba6 b3',
        notes: {
          '5.Nxc6': 'Trade first, so Black has to recapture with a pawn and the queenside gets weak.',
          '6.e5': 'e5 kicks the knight before Black can play ...d5.',
          '7.Qe2': 'The queen guards e5 and blocks the e-file.',
          '8.c4': 'c4 drives the knight off d5.',
          '8...Ba6': 'The bishop pins c4 to your queen.',
          '9.b3': 'b3 holds c4, so the pin costs you nothing.',
        },
      },
      {
        name: 'Mieses, 7...Nb6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Nb6 Nd2',
        notes: { '9.Nd2': 'The knight goes to f3 or b3 and leaves the c1 bishop free for b2.' },
      },
      {
        name: 'Mieses, 8...Qb4+', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Qb4+ Nd2',
        notes: {
          '8...Qb4+': 'Check, and the queen eyes b2.',
          '9.Nd2': 'Block with the knight. 9.Bd2? Qxb2 wins a pawn and hits the a1 rook.',
        },
      },
      {
        name: 'Classical, 5.Nxc6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nxc6 Qf6 Qd2 dxc6 Nc3 Be6 Na4',
        notes: {
          '5...Qf6': 'Queen and bishop both aim at f2. Black threatens Qxf2 mate.',
          '6.Qd2': 'Qd2 guards f2 and stops the mate.',
          '8.Na4': 'Na4 chases the bishop off the a7-g1 diagonal, and you can take it for the bishop pair.',
        },
      },
      {
        name: '5...Bxf2+?', trap: true, moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nxc6 Bxf2+ Kxf2 Qh4+ Kg1',
        notes: {
          '5...Bxf2+': 'Black gives the bishop for one pawn and hopes for an attack.',
          '7.Kg1': 'The king is safe on g1. Black can take back on c6, but you stay a piece for a pawn ahead.',
        },
      },
      {
        name: '6...Qxf2+?', trap: true, moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nxc6 Qf6 Qd2 Qxf2+ Qxf2 Bxf2+ Kxf2',
        notes: {
          '6...Qxf2+': 'f2 is defended twice now, by your queen and king.',
          '8.Kxf2': 'Black traded a bishop for a pawn, and your c6 knight still needs taking back. You end up a piece for a pawn ahead.',
        },
      },
      {
        name: 'Steinitz, 4...Qh4', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3 Bb4 Be2 Qxe4 Nb5',
        notes: {
          '4...Qh4': 'The queen hits e4 and f2 at once.',
          '5.Nc3': 'Nc3 guards e4, because the knight can take a queen that lands there.',
          '6...Qxe4': 'Black takes the pawn, but the queen is out early and c7 is loose.',
          '7.Nb5': 'Nb5 threatens Nxc7+, forking king and rook.',
        },
      },
      {
        name: '5...Qxe4+?', trap: true, moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3 Qxe4+ Nxe4',
        notes: { '6.Nxe4': 'The c3 knight was guarding e4 all along. Black is down a queen.' },
      },
      {
        name: '4...Nxd4', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nxd4 Qxd4 Ne7 Bc4 Nc6 Qd5',
        notes: {
          '5.Qxd4': 'The queen sits in the centre and hits a7 and g7.',
          '7.Qd5': 'Queen and bishop both hit f7. Qd5 threatens Qxf7 mate.',
        },
      },
      {
        name: '3...d6', moves: 'e4 e5 Nf3 Nc6 d4 d6 Bb5 Bd7 Nc3 exd4 Nxd4',
        notes: { '4.Bb5': 'Bb5 pins the knight that defends e5.' },
      },
      { name: '3...exd4 4.Nxd4 d6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 d6 Nc3 Nf6 Be2 Be7 O-O O-O' },
    ],
  },
  {
    id: 'scotch-gambit', name: 'Scotch Gambit', color: 'w',
    blurb: '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Bc4, developing fast instead of taking back on d4.',
    ideas: [
      'You leave the d4 pawn for now and develop with tempo. The c4 bishop aims at f7, the weakest square in Black\'s camp.',
      'Against 4...Nf6, push 5.e5 at once. The knight has to move, and many lines turn into a sharp Two Knights.',
      'Trap: 4...Bc5 5.c3 dxc3? 6.Bxf7+! Kxf7 7.Qd5+ forks the king and the c5 bishop.',
      'Trap: 5.e5 Ne4 6.Qe2 puts your queen behind the knight. If Black plays ...d5 or ...f5, take en passant and the e4 knight is pinned to the king.',
      'Trap: 5.e5 Ng4 6.O-O Ngxe5? 7.Nxe5 Nxe5 8.Re1 pins the knight, and f4 wins it.',
      'Trap: 4...Bc5 5.c3 Nf6 6.e5 Ne4? 7.Bd5 leaves the knight with no safe square, since e5 covers d6 and f6.',
    ],
    lines: [
      {
        name: '4...Nf6 5.e5 d5', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 d5 Bb5 Ne4 Nxd4 Bd7 Bxc6 bxc6 O-O Bc5 f3 Ng5 Be3',
        notes: {
          '5.e5': 'e5 kicks the knight before it can take on e4.',
          '5...d5': 'Black\'s best: it hits your bishop and frees the c8 bishop.',
          '6.Bb5': 'The bishop dodges and pins the c6 knight.',
          '7.Nxd4': 'Now you take the pawn back.',
          '10.f3': 'f3 kicks the e4 knight out of the centre.',
          '11.Be3': 'Be3 adds a defender to d4, which the c5 bishop hits.',
        },
      },
      {
        name: '4...Nf6 5.e5 Ng4', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 Ng4 O-O d6 exd6 Bxd6 Re1+ Kf8 h3',
        notes: {
          '6.O-O': 'Castle first. e5 can wait, and the rook comes to e1 next.',
          '8.Re1+': 'The check costs Black the right to castle.',
          '9.h3': 'h3 kicks the g4 knight.',
        },
      },
      {
        name: '6...Ngxe5?', trap: true, moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 Ng4 O-O Ngxe5 Nxe5 Nxe5 Re1 d6 f4',
        notes: {
          '6...Ngxe5': 'Black grabs e5, but a knight there stands on the e-file in front of its king.',
          '8.Re1': 'Re1 pins the e5 knight to the king.',
          '9.f4': 'f4 attacks the pinned knight. It can\'t step away in time, so you win a piece.',
        },
      },
      {
        name: '4...Nf6 5.e5 Ne4', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 Ne4 Qe2 Nc5 O-O Be7 Rd1',
        notes: {
          '6.Qe2': 'Qe2 hits the knight and lines up on the e-file behind it.',
          '8.Rd1': 'Rd1 goes after the d4 pawn.',
        },
      },
      {
        name: '6...d5?', trap: true, moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 Ne4 Qe2 d5 exd6',
        notes: {
          '6...d5': 'Black supports the knight and hits your bishop. Look at the e-file.',
          '7.exd6': 'Take en passant. Nothing stands between your queen and Black\'s king except the e4 knight, so it is pinned and can\'t be defended in time.',
        },
      },
      {
        name: '4...Bc5 5.c3 Nf6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 c3 Nf6 e5 d5 Bb5 Ne4 cxd4 Bb4+ Bd2 Nxd2 Nbxd2 O-O O-O',
        notes: {
          '5.c3': 'c3 offers a second pawn. You want d4 back with a pawn, not a piece.',
          '6.e5': 'e5 kicks the knight. 6...d5 is Black\'s best answer.',
          '7.Bb5': 'The bishop dodges ...dxc4 and pins the c6 knight.',
          '8.cxd4': 'The pawn is back and you have the centre.',
        },
      },
      {
        name: '6...Ne4?', trap: true, moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 c3 Nf6 e5 Ne4 Bd5',
        notes: {
          '6...Ne4': 'The knight looks active in the centre. Count its squares.',
          '7.Bd5': 'Bd5 attacks the knight, and it has no safe square: e5 covers d6 and f6, and your pieces guard the rest. Black has to give up material.',
        },
      },
      {
        name: '5...dxc3?', trap: true, moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 c3 dxc3 Bxf7+ Kxf7 Qd5+ Kf8 Qxc5+ d6 Qxc3',
        notes: {
          '5...dxc3': 'Black grabs a second pawn and leaves the c5 bishop with no defender.',
          '6.Bxf7+': 'Bxf7+ drags the king onto f7, where Qd5+ checks it.',
          '7.Qd5+': 'The check also hits the c5 bishop.',
          '9.Qxc3': 'You won back both pawns, and Black\'s king can\'t castle.',
        },
      },
      {
        name: '4...Bc5 5.c3 d3', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 c3 d3 b4 Bb6 a4 a6 Qxd3 d6 O-O',
        notes: {
          '5...d3': 'Black gives the pawn back to slow your attack.',
          '6.b4': 'b4 and a4 chase the bishop with tempo. You take d3 back once it has retreated.',
        },
      },
      { name: '4...Bb4+', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bb4+ c3 dxc3 bxc3 Ba5 O-O d6 Qb3 Qd7',
        notes: { '8.Qb3': 'Queen and bishop both hit f7. Black has to spend a move defending it.' } },
      { name: '4...Be7', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 Be7 Nxd4 d6 O-O Nf6 Nc3 O-O h3',
        notes: { '5.Nxd4': 'Against the passive 4...Be7 just take the pawn back. You have a free centre.' } },
      { name: '4...d6', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Bc4 d6 Nxd4 Nf6 Nc3 Be7 O-O O-O h3' },
    ],
  },
  {
    id: 'italian', name: 'Italian Game', color: 'w',
    blurb: '1.e4 e5 2.Nf3 Nc6 3.Bc4, the slow c3 and d3 plan, plus 3...Be7, 3...d6 and the 3...Nd4 trap.',
    ideas: [
      'Plan: c3 and d3, castle, then Nbd2, a4, h3 and Re1. You build slowly and keep d4 for later.',
      'a4 stops ...b5 from chasing your bishop. h3 keeps Black\'s pieces off g4.',
      'Trap: against 3...Nd4 (the Blackburne Shilling Gambit), don\'t take on e5. 4.Nxe5? Qg5! and 5.Nxf7?? Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3 is mate. Play 4.Nxd4.',
      'Trap: an early ...Ng4 hits f2. Castle. If Black goes ...Nxf2 Rxf2 Bxf2+ Kxf2, you have two pieces for a rook and a pawn.',
      'Pitfall: after 3...d6 4.d4 Bg4, play 5.h3. 5.dxe5 Nxe5 6.Nxe5?? Bxd1 loses your queen: Legal\'s mate needs a knight on c3, and yours is still on b1.',
    ],
    lines: [
      {
        name: 'Giuoco Pianissimo', moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Nbd2 a6 a4 Ba7 h3 h6 Re1 Re8',
        notes: {
          '4.c3': 'c3 takes d4 from Black\'s knight and prepares d4 later.',
          '5.d3': 'd3 holds e4, so you can castle without gambits.',
          '7.Nbd2': 'The knight goes to f1 and g3 later. c3 belongs to the pawn.',
          '8.a4': 'a4 stops ...b5 from chasing your bishop.',
          '9.h3': 'h3 keeps Black\'s bishop and knight off g4.',
        },
      },
      {
        name: 'Giuoco Pianissimo, ...d5', moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 O-O O-O d5 exd5 Nxd5 Re1',
        notes: { '8.Re1': 'Re1 hits e5, which Black has to defend now that ...d5 opened the centre.' },
      },
      { name: 'Giuoco Pianissimo, ...a6', moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 a6 O-O d6 a4 Ba7 Re1 O-O h3 h6 Nbd2 Re8' },
      {
        name: 'Two Knights, 4.d3', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 O-O O-O Re1 d6 c3 Na5 Bb5 a6 Ba4 b5 Bc2 c5 Nbd2',
        notes: {
          '4.d3': 'd3 avoids the sharp 4.Ng5 lines and keeps the game slow.',
          '7...Na5': 'The knight goes after your bishop.',
          '8.Bb5': 'Keep the bishop. It drops back to c2 via a4 and still aims at the kingside.',
        },
      },
      { name: 'Two Knights, 4...Bc5', moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 c3 d6 O-O O-O Nbd2 a6 a4 Ba7 h3 h6 Re1 Re8' },
      {
        name: 'Early ...Ng4', trap: true, moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 c3 Ng4 O-O Nxf2 Rxf2 Bxf2+ Kxf2',
        notes: {
          '5...Ng4': 'Knight and bishop both hit f2.',
          '6.O-O': 'Castle. f2 now has the king and rook guarding it.',
          '6...Nxf2': 'Black goes for it anyway.',
          '8.Kxf2': 'Black gave a knight and a bishop for a rook and a pawn. Two pieces beat a rook in the middlegame.',
        },
      },
      {
        name: 'Hungarian, 4...exd4', moves: 'e4 e5 Nf3 Nc6 Bc4 Be7 d4 exd4 Nxd4 Nf6 Nc3 O-O O-O',
        notes: { '4.d4': 'Against the passive 3...Be7, take the centre at once.' },
      },
      {
        name: 'Hungarian, 4...d6', moves: 'e4 e5 Nf3 Nc6 Bc4 Be7 d4 d6 d5 Nb8 Bd3 Nf6 c4',
        notes: {
          '5.d5': 'd5 gains space and sends the knight back to b8.',
          '6.Bd3': 'The bishop guards e4 and gets out of the way of c4.',
        },
      },
      {
        name: '3...d6, 4...Bg4', moves: 'e4 e5 Nf3 Nc6 Bc4 d6 d4 Bg4 h3 Bxf3 Qxf3 Nf6 d5 Nd4 Qd3',
        notes: {
          '4...Bg4': 'The bishop pins your knight. Taking on e5 looks good. Check Black\'s Bxd1 first.',
          '5.h3': 'h3 makes the bishop decide. 5.dxe5 Nxe5 6.Nxe5?? Bxd1 loses your queen, because Legal\'s mate needs a knight on c3.',
          '7.d5': 'd5 kicks the c6 knight.',
          '8.Qd3': 'The queen steps away from the knight and keeps your c4 bishop defended. c3 next kicks the knight.',
        },
      },
      { name: '3...d6, 4...exd4', moves: 'e4 e5 Nf3 Nc6 Bc4 d6 d4 exd4 Nxd4 Nf6 Nc3 Be7 O-O O-O' },
      {
        name: 'Blackburne Shilling', trap: true, moves: 'e4 e5 Nf3 Nc6 Bc4 Nd4 Nxd4 exd4 O-O',
        notes: {
          '3...Nd4': 'The Blackburne Shilling Gambit. e5 looks free. It is bait.',
          '4.Nxd4': '4.Nxe5? Qg5! forks e5 and g2, and 5.Nxf7?? Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3 is mate. Take the knight on d4 instead.',
          '5.O-O': 'Black has moved the same knight twice and swapped it off. You are a tempo up.',
        },
      },
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
