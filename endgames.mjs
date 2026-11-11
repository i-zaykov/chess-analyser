// Endgame drills for the Endgames tab: a position, the side you play and what you must achieve against
// Stockfish. `win` ends at mate, or at a promotion that keeps the win. `draw` ends after `moves` of your
// moves while the engine still calls it level, or at a drawn finish (stalemate, bare kings, repetition).
// `moves` also caps a win: mate takes too long if you need more. tools/check-openings.mjs checks the
// engine agrees with each goal.
export const ENDGAMES = [
  { id: 'kq-k', name: 'Queen mate', goal: 'win', moves: 12, fen: '8/8/8/4k3/8/8/8/4K2Q w - - 0 1',
    tip: 'Box the king in with the queen a knight\'s move away, shrink the box, then bring your king. Watch for stalemate.' },
  { id: 'kr-k', name: 'Rook mate', goal: 'win', moves: 20, fen: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1',
    tip: 'Cut the king off with the rook, walk your king up to take the opposition, then check along the edge.' },
  { id: 'kbb-k', name: 'Two bishops mate', goal: 'win', moves: 25, fen: '8/8/8/4k3/8/8/8/2B1KB2 w - - 0 1',
    tip: 'The bishops side by side build a wall. Push the king to a corner with your king\'s help.' },
  { id: 'kp-opposition', name: 'Pawn ending: take the opposition', goal: 'win', moves: 12, fen: '8/8/3k4/8/3K4/8/3P4/8 w - - 0 1',
    tip: 'Kings face each other with one square between: whoever must move gives way. Spend a pawn move to hand the move to Black, then step forward.' },
  { id: 'kp-key-squares', name: 'Pawn ending: key squares', goal: 'win', moves: 12, fen: '8/8/3k4/8/8/4K3/4P3/8 w - - 0 1',
    tip: 'Get your king two squares in front of the pawn before pushing it. The pawn walks in last.' },
  { id: 'kp-defend', name: 'Pawn ending: hold the draw', goal: 'draw', moves: 10, fen: '8/4k3/8/8/3KP3/8/8/8 b - - 0 1',
    tip: 'Stay in front of the pawn and take the opposition when the white king comes close. Retreat straight back.' },
  { id: 'lucena', name: 'Lucena: build a bridge', goal: 'win', moves: 15, fen: '1K6/1P1k4/8/8/8/8/r7/2R5 w - - 0 1',
    tip: 'Check the king further away, put the rook on the fourth rank, then walk your king out. The rook blocks the checks.' },
  { id: 'philidor', name: 'Philidor: hold the draw', goal: 'draw', moves: 12, fen: '4k3/8/8/3KP3/8/8/7r/R7 b - - 0 1',
    tip: 'Keep your rook on the sixth rank until the pawn advances, then check from behind.' },
  { id: 'kq-kp', name: 'Queen against a pawn on the seventh', goal: 'win', moves: 20, fen: '8/8/8/8/8/1Q6/3pk3/K7 w - - 0 1',
    tip: 'Check or pin until the king has to block its own pawn, then bring your king a step closer.' },
];
