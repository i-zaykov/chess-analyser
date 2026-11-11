# Chess analyser

A single page that loads a month of Chess.com games, runs Stockfish in the browser and labels every move.
The page talks only to the Chess.com API. Its libraries and Stockfish ship inside the app, and Chess.com answers are kept in the browser, so it also works offline for games already loaded.

Try it at **https://i-zaykov.github.io/chess-analyser/**: enter a Chess.com username and it loads that player's latest month. Nothing to install.

## Run it

The app is a small macOS launcher. Building it needs Rust (`cargo`) and the Xcode command line tools.

```bash
git clone https://github.com/i-zaykov/chess-analyser.git
cd chess-analyser
app/build.sh
```

That installs **Chess Analyser** to `~/Applications` (Spotlight and Raycast find it). Opening it starts a small server on http://localhost:8765 and opens that page in your default browser.
It has no Dock icon. It quits about 3 minutes after you close the last tab, and opening it again while it runs opens another tab. After a rebuild, tabs still showing the old page reload by themselves when you next look at them.
Keep using `localhost`, not `127.0.0.1`. The browser caches analyses per address.

The page and the opening table are compiled into the app. After changing `index.html` or `eco.json`, run `app/build.sh` again.

Without the Mac app, use the page above or serve the folder with any static server, for example `python3 -m http.server 8766`, and open http://localhost:8766. Analysis works the same; syncing puzzle progress with a phone needs the Mac app.

## What it does

- The design follows the Commercial Admin design system (green-tinted neutrals, Figtree and Bricolage Grotesque, hairline cards, bundled in `vendor/fonts`), with a classic wood board and chess.com-style move badges. The page is light-only. Wide screens show games, board and review side by side; medium screens put the games under the board; phones get the two-screen layout. Above phone size the board fits the window with its controls, and the move card (the verdict, why, Explain and Best move) heads the column next to the board, so it is in view without scrolling. On a phone the card sits under the board and leads with Explain and Best move, so they show without scrolling, and the step buttons, the card's buttons, the pane tabs and the move list are at least 44 px tall for thumbs.

- Loads the archive list for a username, then one month of games. Variant games (960, etc.) are skipped.
- Analyses every position at a fixed depth (default 18, set in Settings). Each "engine" is one single-threaded Stockfish worker, and positions are spread across them, so one game uses all of them.
- Labels moves by the win-chance points they throw away, with Chess.com's cutoffs: inaccuracy 5, mistake 10, blunder 20. Win chance comes from the eval on the same curve as the graph, so walking into mate at −6 costs less than dropping a piece at equality. A move that matches the engine's top choice is `best`. Moves up to the deepest position found in the ECO table are `book` unless they are blunders.
- Move list shows the label, the eval after the move and the engine's line when the move wasn't best. The graph plots win percentage. Click it to jump to that move.
- On a phone the Games tab is two screens: the list, and the game you opened with a ‹ Games button back. It opens on your latest game's review summary, like Chess.com's app, and Start review brings in the board at the first key moment; the Review tab goes back to the summary.
- Opening the app shows your latest game. New games show up without a reload: the newest month is fetched again when you press Load, when the tab comes back into view, and every 3 minutes while it's visible, and your newest game stays open if it was. A phone always starts on your latest game, even from a link to another one, and coming back to it after a new game or 5 minutes away opens the latest game again; a quicker switch keeps your place. Next key moment (or `↓`, `↑` to go back) jumps to the moves that decided the game: mistakes and blunders by either side that threw away at least 8 win-chance points.
- Keys: `←` `→` step, `Home` `End`, `↑` `↓` key moments, `b` best move instead of the last one (again to go back), `e` plays the reply that punishes the last move, `h` hint, `f` flips the board.
- Each move gets a Chess.com-style badge on the square it landed on (★ best, ✓ excellent or good, a book for theory, ?! ? ?? for errors), and its squares take the same colour.
- Green arrow is what should have been played instead of the last move. Red arrow is the reply that punishes an error. Blue arrow (Hint, `h`) is the engine's move in the current position.
- Every move that wasn't the engine's choice says why, from the engine's lines: what it allowed (a piece left hanging, a fork, a check that wins material, mate) and what the best move does instead (wins material, takes or attacks a piece, gives check, mates).
- Clicking the piece that moved wrong (or Explain, or `e`) plays the reply that punishes it (on a good move that wasn't the engine's, the better move instead), so the board shows why it's a problem: the line to step through with `→`, red circles on what the reply hits (a piece left hanging, a fork's targets, the king it mates), and the reason, such as "10…Qe7 leaves the knight on a5 hanging". The line and its reason replace the move card, next to the board above phone size and under it on a phone, until you go back (Esc). Show best instead switches to the engine's move.
- Best move (or `b`) puts the engine's move on the board instead, with its reason kept beside the line. In the error lists under a game and in the review, clicking "best Nf6" opens the game there with the best move already on the board.
- Explain and Best move put that move on the board as if it had been played, with the rest of the engine's line queued: `→` or Play steps through it (instantly, the engine already scored it), and any other move branches off into your own line.
- The board is playable. Picking up a piece of the side to move shows where it can go. Playing the game's own move steps forward; any other move starts your own line from there. The engine scores each position of it, badges your moves, and shows its best move with a button to play it, so you can click through how a resigned or abandoned game would have finished. `Esc` goes back to the game.
- Explorer (next to Moves): for the position on the board, what you played there and what your opponents played, across every loaded game, with games, your result and the average cost of each move, book moves marked, and the engine's move. Click a move to play it. Lichess's explorer needs a login now, so it isn't used.
- Opening drills (Puzzles > Your openings): positions from the first 12 moves that your games reach at least twice, where at least once you played a move costing 50 cp or more while the game was roughly level. One card per position, however many games it came up in, on the same schedule as puzzles. A missed card joins the daily reviews.
- With a month on screen, the rest of the account loads in the background, newest month first, so puzzles and patterns cover every game. The side list shows the month's latest 10 games (Show 10 more adds more), and Settings > Analyse automatically decides what gets analysed: the games in the list (the default), every game, or only the game you open. Only one open tab does the background work.
- Analyses and puzzles are stored in IndexedDB (about 2.5 KB per game), which has room for years of games. Earlier versions used `localStorage`; the first load moves that data over.
- Analysis runs in the browser tab. It is fastest while the tab is visible; macOS can slow it down a lot when the window is hidden.
- Opening a game shows its review in a popup over the page, like Chess.com's Game Review: one sentence on the move that decided it, the eval graph, each player's rating change, accuracy, move counts by label, "played like" and a rating for the opening, middlegame and endgame (the label the average cost of their moves there would earn). The popup is sized to the window, with tighter rows on short windows, so the whole summary and Start review show without scrolling down to about 600 px of height. Start review jumps to the first key moment and closes the popup. `Esc`, a click beside the popup or stepping through the game also close it, and the Review tab brings it back. On a phone the review is a screen of its own (see above).
- Each player bar shows the rating change of the game (Chess.com's archive gives ratings after each game, so yours is exact; the opponent's is the mirror) and "played like ~N": the rating before the game plus K points per point of accuracy above what's typical at that rating. The typical accuracy and K are fitted on your own games (K is how many rating points an accuracy point is worth when predicting who wins; about 18 on this account). It is rough for one game; Summary shows the average.
- Summary tab: accuracy, ACPL and errors per game, split by colour, time control and opening. Everything is computed from the cache when you open the tab. Nothing aggregate is stored.
- Filters (result, colour, time control, "has my blunder") apply to the list, the summary and the "Analyse" button.
- Exports: annotated PGN per game or per month (NAGs, `[%eval]`, `[%clk]` and the engine line as a variation), summary CSV and raw analysis JSON.

## Puzzles

- Each of your errors that cost 8 or more win-chance points becomes a "find the better move" puzzle once its game is analysed, in the page or by the batch script. That is every mistake and blunder plus the costliest inaccuracies. A month's puzzles are built when you load that month.
- Skipped: positions that were already lost.
- One puzzle per idea: mistakes a few moves apart with the same better move, or punished on the same square, are merged and the costliest one kept.
- The library is not a to-do list. Each day shows the reviews that are due plus 10 new puzzles (Settings > New puzzles per day). New ones come from the core set, the two costliest real lessons of each game (a tactic or a blunder), ranked by how much they cost and how recent they are, at most one per game and at most a third of a day sharing a main pattern. The badge counts only today's puzzles; "10 more" adds another batch.
- The dropdown in Puzzles, or Practise in Patterns, drills one pattern (say "Walked into a fork") 10 at a time: unseen first, then the ones you got wrong.
- You play the whole combination, not just its first move. After each right move the opponent's best reply is played and you continue, for as long as the engine's best line stays forcing (a check, capture or promotion that still wins something) or leads to mate, up to 6 of your moves. At each step the engine's move is right, and any other move counts if the engine scores it within an inaccuracy (50 cp). Show solution plays the rest of the line from where you are: a mate in full, any other win up to its last check or capture.
- Only puzzles you got wrong come back. One you solve at first sight, without the hint, is learned. A miss, the hint or Show solution brings it back in a week, never the same day; while you keep solving it, it returns after two weeks, then a month, and is then learned. A miss starts it over. A position you reached in several games counts as one puzzle.
- Puzzles are stored separately from analyses, so clearing analyses keeps them. Every change is one IndexedDB transaction and open tabs tell each other about it, so two tabs never overwrite each other's progress.

## Patterns

- Every puzzle carries what Stockfish says went wrong: material lost to the opponent's best reply, material you missed, fork, check, mate, threw away a win, time pressure, plus the phase, the piece you moved, the opening, the clock and whether you had castled.
- The Patterns tab counts those tags across your mistakes, per month, with a Practise button for each.

## Openings

- The Openings tab drills a repertoire built from what this account plays: the Caro-Kann and the Slav as Black; the Scotch, the Italian, and answers to the Petrov, Philidor, Sicilian (Alapin), Scandinavian and French as White. The lines live in `openings.mjs`.
- You play your side of a line from memory and the trainer plays the other side. A new line is shown once with arrows, then asked again without them.
- A wrong move is taken back, with the line's move as an arrow, and Stockfish says whether yours was playable anyway or how many pawns it costs. You then play the right move and carry on.
- A line you finish without a slip comes back after 1, 3, 7 and 21 days, then counts as learned. A slip starts it over. Practise takes the due lines plus 3 new ones.
- Each opening lists where your loaded games left it: the position, what you played, what the line plays and how often, with a Drill button for that line. A move that leads into another of your openings (3.d4 instead of the Italian's 3.Bc4) doesn't count as leaving.
- Progress is kept in this browser's `localStorage`, keyed by each line's moves, so editing a line starts that line over.

## Endgames

- The Endgames tab has positions to win or hold against Stockfish: queen, rook and two-bishop mates, king and pawn endings (opposition, key squares, holding the draw), Lucena, Philidor, and queen against a pawn on the seventh. They live in `endgames.mjs`.
- You play the side to move. A win ends at mate, or at a promotion the engine still calls winning. A draw ends after the drill's number of moves while the engine still calls it level, or at stalemate, bare kings or a repetition.
- Until you have solved a drill once on your own, it plays with arrows: a green arrow shows the engine's move every turn, like a new opening line. You can follow it or play your own move. Runs with arrows aren't counted. After one, Now without arrows starts the counted attempt.
- A move that throws away the win, or loses the drawn position, ends the drill and says why: what the other side takes, the rule of the ending it broke (the king leads the pawn, the opposition, the king in front of the pawn, the Philidor rook on the sixth, the Lucena rook on the fourth, stalemate) and the move that kept it. The board then plays the engine's punishing line. Show why again and Play the better move replay either line. Without arrows, Hint shows the engine's move as a blue arrow.

`node tools/check-openings.mjs` checks both files: every move legal, one answer per position for your side, no move of yours more than 0.75 pawns worse than Stockfish's, and each endgame goal matching the engine.

## Batch mode

```bash
cd tools && npm install
node batch.mjs --user YOUR_NAME --last 2 --depth 18
```

This writes `data/<user>/<yyyy-mm>.json`. When the page loads that month it copies any game it has no result for, or has at a lower depth, into its cache.
It uses `stockfish` from PATH if installed (`brew install stockfish`). Otherwise it downloads the same 7 MB wasm build the page uses and runs it under Node.
Other flags: `--month 2024-01` (repeatable), `--procs N` (defaults to cores minus one), `--engine PATH`, `--force`.

## Scoring

- Scores are stored from white's side. Mate in n is stored as `±(30000 - n)`.
- Evals are clamped to ±10 pawns before computing loss, so a mate that becomes +12 doesn't count as a blunder.
- Accuracy uses the Lichess formula: win% from centipawns, a per-move accuracy from the win% drop, then the average of the arithmetic and harmonic means. It won't match Chess.com's number.

## Pieces

- `core.mjs`: the parts the page and the batch script must agree on: reading a PGN into positions, and the UCI engine protocol with its score encoding.
- `index.html`: the rest of the app. Its third-party files are in `vendor/`: chess.js 1.4.0, chessground 9.2.1 with its board and piece styles, qrcode-generator 1.4.4 and Stockfish 17.1 lite (GPLv3). `cd tools && npm run vendor` fetches them again after a version change; the Mac app compiles them in (about 8 MB).
- Chess.com answers are kept in the browser's Cache Storage. A month saved after it ended can't change, so it is read from there without asking Chess.com; the current month and the archive list are fetched each time and fall back to the saved copy offline.
- `eco.json`: 3,814 opening positions keyed by FEN, built from [lichess-org/chess-openings](https://github.com/lichess-org/chess-openings) (CC0) by `tools/build-eco.mjs`. Rebuild with `npm run eco`.
- `tools/batch.mjs`: offline analysis.
- `data/`: batch output. The app reads it from this folder at runtime, so batch results show up without a rebuild.
- `app/`: the Rust launcher (standard library only), its `Info.plist`, icon script and `build.sh`.
- `tools/patterns-proto.mjs`: the command-line prototype of the mistake tags.
