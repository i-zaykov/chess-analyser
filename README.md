# Chess analyser

A single page that loads a month of Chess.com games, runs Stockfish in the browser and labels every move.
The page talks only to the Chess.com API. Its libraries and Stockfish ship inside the app, and Chess.com answers are kept in the browser, so it also works offline for games already loaded.

## Run it

Open **Chess Analyser** from `~/Applications` (Spotlight and Raycast find it). It starts a small server on http://localhost:8765 and opens that page in your default browser.
It has no Dock icon. It quits about 3 minutes after you close the last tab, and opening it again while it runs opens another tab.
Keep using `localhost`, not `127.0.0.1`. The browser caches analyses per address.

The page and the opening table are compiled into the app. After changing `index.html` or `eco.json`, rebuild and reinstall:

```bash
/Users/ivan.zaykov/lenus/personal/chess-analyser/app/build.sh
```

## What it does

- Loads the archive list for a username, then one month of games. Variant games (960, etc.) are skipped.
- Analyses every position at a fixed depth (default 18, set in Settings). Each "engine" is one single-threaded Stockfish worker, and positions are spread across them, so one game uses all of them.
- Labels moves by eval loss against the engine's best move: inaccuracy 50 cp, mistake 100 cp, blunder 300 cp. A move that matches the engine's top choice is `best`. Moves up to the deepest position found in the ECO table are `book` unless they lose 300 cp or more.
- Move list shows the label, the eval after the move and the engine's line when the move wasn't best. The graph plots win percentage. Click it to jump to that move.
- On a phone the Games tab is two screens: the list, and the game you opened with a ‹ Games button back. It opens on your latest game with its review right under the board, and the move coaching takes over once you press Start review.
- Opening the app shows your latest game. New games show up without a reload: the newest month is fetched again when you press Load, when the tab comes back into view, and every 3 minutes while it's visible, and your newest game stays open if it was. Next key moment (or `↓`, `↑` to go back) jumps to the moves that decided the game: mistakes and blunders by either side that threw away at least 8 win-chance points.
- Keys: `←` `→` step, `Home` `End`, `↑` `↓` key moments, `h` hint, `f` flips the board.
- Each move gets a Chess.com-style badge on the square it landed on (★ best, ✓ excellent or good, a book for theory, ?! ? ?? for errors), and its squares take the same colour.
- Green arrow is what should have been played instead of the last move. Red arrow is the reply that punishes an error. Blue arrow (Hint, `h`) is the engine's move in the current position.
- Explain, on every mistake, shows the position you should have reached: after the better move when the error was yours, after the move that punishes it when it was your opponent's.
- Best move and Your reply put that move on the board as if it had been played, with the rest of the engine's line queued: `→` or Play steps through it (instantly, the engine already scored it), and any other move branches off into your own line.
- The board is playable. Picking up a piece of the side to move shows where it can go. Playing the game's own move steps forward; any other move starts your own line from there. The engine scores each position of it, badges your moves, and shows its best move with a button to play it, so you can click through how a resigned or abandoned game would have finished. `Esc` goes back to the game.
- Explorer (next to Moves): for the position on the board, what you played there and what your opponents played, across every loaded game, with games, your result and the average cost of each move, book moves marked, and the engine's move. Click a move to play it. Lichess's explorer needs a login now, so it isn't used.
- Opening drills (Puzzles > Your openings): positions from the first 12 moves that your games reach at least twice, where at least once you played a move costing 50 cp or more while the game was roughly level. One card per position, however many games it came up in, on the same schedule as puzzles. A missed card joins the daily reviews.
- With a month on screen, the rest of the account loads in the background, newest month first, so puzzles and patterns cover every game. The side list shows the month's latest 10 games (Show 10 more adds more), and Settings > Analyse automatically decides what gets analysed: the games in the list (the default), every game, or only the game you open. Only one open tab does the background work.
- Analyses and puzzles are stored in IndexedDB (about 2.5 KB per game), which has room for years of games. Earlier versions used `localStorage`; the first load moves that data over.
- Analysis runs in the browser tab. It is fastest while the tab is visible; macOS can slow it down a lot when the window is hidden.
- Opening a game shows its review in the right column, like Chess.com's Game Review: one sentence on the move that decided it, the eval graph, each player's rating change, accuracy, move counts by label, "played like" and a rating for the opening, middlegame and endgame (the label the average cost of their moves there would earn). Start review jumps to the first key moment and switches to the moves.
- Each player bar shows the rating change of the game (Chess.com's archive gives ratings after each game, so yours is exact; the opponent's is the mirror) and "played like ~N": the rating before the game plus K points per point of accuracy above what's typical at that rating. The typical accuracy and K are fitted on your own games (K is how many rating points an accuracy point is worth when predicting who wins; about 18 on this account). It is rough for one game; Summary shows the average.
- Summary tab: accuracy, ACPL and errors per game, split by colour, time control and opening. Everything is computed from the cache when you open the tab. Nothing aggregate is stored.
- Filters (result, colour, time control, "has my blunder") apply to the list, the summary and the "Analyse" button.
- Exports: annotated PGN per game or per month (NAGs, `[%eval]`, `[%clk]` and the engine line as a variation), summary CSV and raw analysis JSON.

## Puzzles

- Each of your mistakes and blunders becomes a "find the better move" puzzle once its game is analysed, in the page or by the batch script. A month's puzzles are built when you load that month.
- Skipped: positions that were already lost, and moves that changed your winning chances by less than 8 points (+6 to +5 is a 100 cp "mistake" but still winning).
- One puzzle per idea: mistakes a few moves apart with the same better move, or punished on the same square, are merged and the costliest one kept.
- The library is not a to-do list. Each day shows the reviews that are due plus 10 new puzzles (Settings > New puzzles per day). New ones come from the core set, the two costliest real lessons of each game (a tactic or a blunder), ranked by how much they cost and how recent they are, at most one per game and at most a third of a day sharing a main pattern. The badge counts only today's puzzles; "10 more" adds another batch.
- The dropdown in Puzzles, or Practise in Patterns, drills one pattern (say "Walked into a fork") 10 at a time: unseen first, then the ones you got wrong.
- You play the whole combination, not just its first move. After each right move the opponent's best reply is played and you continue, for as long as the engine's best line stays forcing (a check, capture or promotion that still wins something) or leads to mate, up to 6 of your moves. At each step the engine's move is right, and any other move counts if the engine scores it within an inaccuracy (50 cp). Show solution plays the rest of the line from where you are: a mate in full, any other win up to its last check or capture.
- Only puzzles you got wrong come back. One you solve at first sight, without the hint, is learned. A miss, the hint or Show solution brings it back in a week, never the same day; while you keep solving it, it returns after two weeks, then a month, and is then learned. A miss starts it over. A position you reached in several games counts as one puzzle.
- Puzzles are stored separately from analyses, so clearing analyses keeps them. Every change is one IndexedDB transaction and open tabs tell each other about it, so two tabs never overwrite each other's progress.

## Patterns

- Every puzzle carries what Stockfish says went wrong: material lost to the opponent's best reply, material you missed, fork, check, mate, threw away a win, time pressure, plus the phase, the piece you moved, the opening, the clock and whether you had castled.
- The Patterns tab counts those tags across your mistakes, per month, with a Practise button for each.

## Batch mode

```bash
cd chess-analyser/tools && npm install
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
