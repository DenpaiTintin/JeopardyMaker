# JeopardyMaker

Easy code to make Jeopardy games. The game runs in the browser using plain HTML, CSS and JavaScript, so there is nothing to install.

## Starting the game

Open `index.html` in a web browser (Edge, Chrome, Firefox, etc.). In File Explorer, double-click the file, or paste its path into the browser's address bar.

> Opening `index.html` in a code editor (VS Code, for example) only shows the code. You have to open it in a browser to play.

After you change something, save the file and press **F5** in the browser.

### Start screen

The game opens on a start screen where you choose:

- **Number of teams** (1–8) and their names.
- **Timer**: a countdown on every question, with the number of seconds you choose.
- **Daily Double**: how many hidden Daily Double tiles the board gets.
- **Finalerunde** (final round): one last question after the board is done.

Press **Start spillet** (Start game) to play with those choices.

## Customizing the game

Everything you need to change is in **`questions.js`**. You don't need to touch the other files.

### Title

```js
title: "Jeopardy!",
```

### Teams

These are the default team names on the start screen. The number of teams and the names can be changed there before each game.

```js
teams: ["Team 1", "Team 2", "Team 3", "Team 4"],
```

### Default settings

What is preselected on the start screen:

```js
settings: {
  timer: false,         // show a countdown on every question
  timerSeconds: 30,     // seconds per question
  dailyDouble: true,    // hide Daily Doubles on the board
  dailyDoubleCount: 1,  // how many Daily Doubles
  finalRound: true,     // play the final round when the board is done
},
```

### Final round

```js
finalRound: {
  category: "Norway",
  question: "Which city was the capital of Norway before Oslo?",
  answer: "Bergen",
  image: "images/finale.svg", // optional background image
  timerSeconds: 30,           // used when the timer is turned on
},
```

If you remove `finalRound`, the final round option is disabled on the start screen.

### Categories and questions

Each category has a `name` and a list of `questions`. Each question has these fields:

| Field      | What it does                                                   |
|------------|----------------------------------------------------------------|
| `points`   | The value shown on the board                                   |
| `question` | The text shown when the tile is opened                         |
| `answer`   | The answer shown when you press "Vis svar" (Show answer)       |
| `image`    | Background image while the question is open (optional)         |

```js
{
  name: "Geography",
  questions: [
    { points: 100, question: "What is the capital of Norway?", answer: "Oslo", image: "images/oslo.jpg" },
    { points: 200, question: "What is the longest river in the world?", answer: "The Nile" },
  ],
},
```

- **More or fewer categories:** add or remove whole `{ name: ..., questions: [...] }` blocks. The board gets one column per category.
- **More or fewer questions:** add or remove lines in `questions`. The board gets as many rows as the category with the most questions. If a category has fewer questions than the others, its empty tiles are shown as already answered.
- Questions appear on the board in the order they are listed, from top to bottom.
- Remember the comma between blocks and between questions.

## Images

Put your image files in the **`images`** folder and refer to them as `"images/filename.jpg"`.

- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` and `.svg`.
- The file name in `questions.js` must match the file exactly, including the extension.
- Avoid spaces and special characters (such as æ, ø, å) in file names.
- Very large images (several MB, such as photos straight from a phone) can take a moment to load.

### Question background

Set `image` on a question to show that image behind it. The text and buttons sit in a dark box so they stay readable on any image. If you leave out `image`, the question gets a plain blue background.

### Puzzle image

```js
puzzleImage: "images/puslespill.svg",
```

This image is hidden behind the tiles on the board. Each time a question is closed, that tile becomes transparent and its part of the image shows through. When every question has been answered, the whole image appears.

The image is stretched to fill the board and may be cropped slightly at the edges, so landscape images work best.

The images that come with the project are placeholders. Replace them with your own.

## How to play

1. Click a tile to open the question.
2. Press **Vis svar** (Show answer), or the **space bar**, to show the answer.
3. Award points with the buttons next to each team:
   - **+** = correct (adds the points), **−** = wrong (subtracts the points).
   - Each team can be marked only once per question. Click the same button again to undo, or the other button to switch.
   - Only one team can be correct. The other teams' **+** buttons are disabled until you undo.
4. Press **Lukk** (Close), or **Escape**, to go back to the board.

**Fixing scores:** click a team's score on the main screen, type the new number and press **Enter** (or **Escape** to cancel).

### Timer

When the timer is on, it starts as soon as a question is shown and stops when the answer is revealed. The last five seconds turn red, and then "Tiden er ute!" (Time's up!) appears. Click the timer to restart it.

### Daily Double

Daily Doubles are placed on random tiles at the start of each game, never in the top row. When one is opened:

1. Choose the team that picked the tile.
2. Enter their wager: at least 5, and up to their score or the highest value on the board, whichever is more.
3. The question is shown, and only that team can answer. Correct adds the wager, wrong subtracts it.

### Final round and winner

When every tile is answered, a button appears under the scoreboard: **Start finalerunden** (Start the final round) if the final round is on, otherwise **Vis vinneren** (Show the winner).

1. The category is shown. Each team secretly writes down a wager, from 0 up to all its points, and you enter the wagers.
2. The question is shown (with the timer, if it is on). Teams write their answers down.
3. Reveal the answer and mark each team **+** or **−**. Several teams can be correct here.
4. **Vis vinneren** shows the winner and the final standings. **Spill igjen** (Play again) goes back to the start screen.

> The game does not save its progress. Refreshing the page (F5) starts a new game.

## Files

| File           | Contents                                   |
|----------------|--------------------------------------------|
| `questions.js` | Title, teams, settings, images and questions (edit this) |
| `index.html`   | Page structure                             |
| `style.css`    | Colors and layout                          |
| `setup.js`     | Start screen                               |
| `game.js`      | Board, questions, timer and Daily Double   |
| `final.js`     | Final round and winner screen              |
| `images/`      | Images for questions and the puzzle        |
