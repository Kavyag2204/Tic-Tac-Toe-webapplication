# Tic-Tac-Toe — PvP & PvC

A modern, responsive Tic-Tac-Toe game with two modes: Player vs Player (PvP) and Player vs Computer (PvC). The computer opponent uses an unbeatable Minimax AI. Includes quality-of-life features like Undo, Hint, and persistent round scores, wrapped in a sleek neon UI.

## Quick Start

- Open `task3.html` in any modern browser (Chrome, Edge, Firefox, Safari).
- No build steps or installs required.

## Features

- Player vs Player and Player vs Computer modes
- Unbeatable Minimax AI for CPU turns
- Choose to play as `X` (first) or `O`
- Undo last move (smart undo in PvC undoes both the player and CPU moves)
- Hint highlights the best move according to Minimax
- Round scores for `X`, `O`, and Draws, with Reset Scores
- Responsive layout and accessible roles/labels

## How to Play

1. Choose a mode from the Mode dropdown.
2. If in PvC, choose whether you play as `X` or `O`.
3. Click any empty cell to place your mark.
4. Use:
   - New Game: clear the current board
   - Undo: revert the previous move (and CPU reply in PvC)
   - Hint: briefly highlight the optimal next move
   - Reset Scores: clear cumulative round scores

## Project Structure

- `task3.html` — Main page and UI structure
- `style.css` — Styles (responsive neon theme)
- `script.js` — Game logic, UI updates, Minimax AI, and controls

## Implementation Notes

- Winner detection checks all classic 3-in-a-row lines and highlights the winning cells.
- Minimax evaluates terminal outcomes and searches all available moves; when the CPU plays, it maximizes its score, while the human is treated as minimizing.
- Turns, status text, and mode labels are updated live. The board is disabled when the game ends.

## Browser Support

Tested on latest Chromium and Firefox engines. No external dependencies.

## License

MIT

###Screenshot
https://drive.google.com/file/d/1SzyJHyvwHaYCjcrAs2YrG18K5GZo5yP1/view?usp=drivesdk
