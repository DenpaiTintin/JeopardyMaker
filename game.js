// Game logic. The content itself is edited in questions.js.

let teams = [];
let scores = [];
let options = {}; // the choices made on the start screen
let current = null; // { tile, category, question, dailyDouble, points, allowedTeams, results }

const gameScreen = document.getElementById("game");
const categoriesRow = document.getElementById("categories");
const tilesGrid = document.getElementById("tiles");
const scoreboard = document.getElementById("scoreboard");
const endBtn = document.getElementById("end-btn");
const modal = document.getElementById("modal");
const modalCategory = document.getElementById("modal-category");
const questionStage = document.getElementById("question-stage");
const modalQuestion = document.getElementById("modal-question");
const modalAnswer = document.getElementById("modal-answer");
const modalTeams = document.getElementById("modal-teams");
const revealBtn = document.getElementById("reveal-btn");
const closeBtn = document.getElementById("close-btn");
const ddStage = document.getElementById("dd-stage");
const ddTeams = document.getElementById("dd-teams");
const ddWager = document.getElementById("dd-wager");
const ddHint = document.getElementById("dd-hint");
const ddStartBtn = document.getElementById("dd-start-btn");

// Called from the start screen
function startGame(chosenTeams, chosenOptions) {
  teams = chosenTeams;
  scores = teams.map(() => 0);
  options = chosenOptions;

  buildBoard();
  if (options.dailyDouble) placeDailyDoubles(options.dailyDoubleCount);
  renderScores();
  gameScreen.classList.remove("hidden");
}

function buildBoard() {
  document.getElementById("title").textContent = GAME.title;

  const columns = GAME.categories.length;
  const rows = Math.max(...GAME.categories.map((c) => c.questions.length));
  const gridColumns = `repeat(${columns}, minmax(0, 1fr))`;
  categoriesRow.style.gridTemplateColumns = gridColumns;
  tilesGrid.style.gridTemplateColumns = gridColumns;
  tilesGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  tilesGrid.style.backgroundImage = `url("${GAME.puzzleImage}")`;

  for (const category of GAME.categories) {
    const header = document.createElement("div");
    header.className = "category";
    header.textContent = category.name;
    categoriesRow.appendChild(header);
  }

  // Fill the board row by row so the point values line up
  for (let row = 0; row < rows; row++) {
    for (const category of GAME.categories) {
      const question = category.questions[row];
      const tile = document.createElement("button");
      tile.className = "tile";

      if (question) {
        tile.textContent = question.points;
        tile.addEventListener("click", () => openQuestion(tile, category, question));
      } else {
        // No question here, so this part of the image is visible from the start
        tile.classList.add("used");
      }
      tilesGrid.appendChild(tile);
    }
  }
  checkComplete();
}

// Hide Daily Doubles on random tiles, but not in the top row (like on TV)
function placeDailyDoubles(count) {
  const tiles = [...tilesGrid.children];
  const columns = GAME.categories.length;
  const open = tiles.filter((t) => !t.classList.contains("used"));
  let candidates = open.filter((t) => tiles.indexOf(t) >= columns);
  if (candidates.length === 0) candidates = open;

  for (let n = 0; n < count && candidates.length > 0; n++) {
    const index = Math.floor(Math.random() * candidates.length);
    const [tile] = candidates.splice(index, 1);
    tile.dataset.dailyDouble = "true";
  }
}

// When every tile is answered, the borders are removed so the whole image shows
function checkComplete() {
  const allUsed = [...tilesGrid.children].every((t) => t.classList.contains("used"));
  tilesGrid.classList.toggle("complete", allUsed);
  endBtn.classList.toggle("hidden", !allUsed);
  endBtn.textContent = options.finalRound ? "Start finalerunden" : "Vis vinneren";
}

endBtn.addEventListener("click", () => (options.finalRound ? startFinal() : showWinner()));

function highestBoardValue() {
  return Math.max(...GAME.categories.flatMap((c) => c.questions.map((q) => q.points)));
}

function renderScores() {
  scoreboard.innerHTML = "";
  teams.forEach((name, i) => {
    const team = document.createElement("div");
    team.className = "team";
    team.innerHTML = `
      <div class="team-name"></div>
      <div class="team-score ${scores[i] < 0 ? "negative" : ""}">${scores[i]}</div>
    `;
    team.querySelector(".team-name").textContent = name;
    const scoreEl = team.querySelector(".team-score");
    scoreEl.title = "Klikk for å endre poengene";
    scoreEl.addEventListener("click", () => editScore(i, scoreEl));
    scoreboard.appendChild(team);
  });
}

// ---------- Timer ----------

// A countdown shown as a number and a shrinking bar. Click it to restart.
function createTimer(container) {
  container.innerHTML = `<div class="timer-bar"><div class="timer-fill"></div></div>
    <div class="timer-text"></div>`;
  container.title = "Klikk for å starte timeren på nytt";
  const fill = container.querySelector(".timer-fill");
  const text = container.querySelector(".timer-text");
  let interval = null;
  let total = 0;

  function stop() {
    clearInterval(interval);
    interval = null;
  }

  function start(seconds) {
    stop();
    total = seconds;
    let left = seconds;
    container.classList.remove("hidden", "expired");

    const render = () => {
      text.textContent = left > 0 ? left : "Tiden er ute!";
      fill.style.width = `${(left / total) * 100}%`;
      container.classList.toggle("warning", left > 0 && left <= 5);
      container.classList.toggle("expired", left <= 0);
    };
    render();

    interval = setInterval(() => {
      left--;
      render();
      if (left <= 0) stop();
    }, 1000);
  }

  function hide() {
    stop();
    container.classList.add("hidden");
  }

  container.addEventListener("click", () => start(total));
  return { start, stop, hide };
}

const questionTimer = createTimer(document.getElementById("modal-timer"));

// ---------- Question window ----------

function openQuestion(tile, category, question) {
  if (tile.classList.contains("used")) return;
  const dailyDouble = tile.dataset.dailyDouble === "true";
  current = {
    tile,
    category,
    question,
    dailyDouble,
    points: question.points,
    allowedTeams: teams.map((_, i) => i),
    // Each team gets one result per question: 1 = correct, -1 = wrong, 0 = not answered
    results: teams.map(() => 0),
  };

  modal.style.backgroundImage = question.image ? `url("${question.image}")` : "none";
  modalCategory.textContent = `${category.name} – ${question.points}`;

  if (dailyDouble) showDailyDouble();
  else showQuestion();
  modal.classList.remove("hidden");
}

function showQuestion() {
  ddStage.classList.add("hidden");
  questionStage.classList.remove("hidden");

  modalQuestion.textContent = current.question.question;
  modalAnswer.textContent = current.question.answer;
  modalAnswer.classList.add("hidden");
  revealBtn.classList.remove("hidden");
  renderModalTeams();

  if (options.timer) questionTimer.start(options.timerSeconds);
  else questionTimer.hide();
}

function renderModalTeams() {
  const someoneRight = current.results.includes(1);

  modalTeams.innerHTML = "";
  for (const i of current.allowedTeams) {
    const result = current.results[i];
    const row = document.createElement("div");
    row.className = "modal-team";
    row.innerHTML = `<span></span>
      <button class="btn-right" title="Riktig">+</button>
      <button class="btn-wrong" title="Feil">−</button>`;
    row.querySelector("span").textContent = teams[i];

    const rightBtn = row.querySelector(".btn-right");
    const wrongBtn = row.querySelector(".btn-wrong");
    if (result === 1) rightBtn.classList.add("selected");
    if (result === -1) wrongBtn.classList.add("selected");
    // Only one team can be correct
    if (someoneRight && result !== 1) rightBtn.disabled = true;

    rightBtn.addEventListener("click", () => setResult(i, 1));
    wrongBtn.addEventListener("click", () => setResult(i, -1));
    modalTeams.appendChild(row);
  }
}

// Clicking the same button again undoes, clicking the other one switches
function setResult(teamIndex, result) {
  const previous = current.results[teamIndex];
  const next = previous === result ? 0 : result;

  scores[teamIndex] += (next - previous) * current.points;
  current.results[teamIndex] = next;

  renderModalTeams();
  renderScores();
}

function editScore(teamIndex, scoreEl) {
  const input = document.createElement("input");
  input.type = "number";
  input.className = "score-input";
  input.value = scores[teamIndex];
  scoreEl.replaceWith(input);
  input.focus();
  input.select();

  let done = false;
  const finish = (save) => {
    if (done) return;
    done = true;
    const value = parseInt(input.value, 10);
    if (save && !Number.isNaN(value)) scores[teamIndex] = value;
    renderScores();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });
  input.addEventListener("blur", () => finish(true));
}

function revealAnswer() {
  questionTimer.stop();
  modalAnswer.classList.remove("hidden");
  revealBtn.classList.add("hidden");
}

function closeQuestion() {
  questionTimer.stop();
  current.tile.classList.add("used");
  current = null;
  modal.classList.add("hidden");
  checkComplete();
}

revealBtn.addEventListener("click", revealAnswer);
closeBtn.addEventListener("click", closeQuestion);

// ---------- Daily Double ----------

// The team that picked the tile places a wager and is the only one who can answer
function showDailyDouble() {
  questionTimer.hide();
  questionStage.classList.add("hidden");
  ddStage.classList.remove("hidden");
  modalCategory.textContent = current.category.name;
  ddWager.value = "";
  ddHint.textContent = "Velg laget først.";
  current.ddTeam = null;
  renderDailyDoubleTeams();
}

function renderDailyDoubleTeams() {
  ddTeams.innerHTML = "";
  teams.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = name;
    if (current.ddTeam === i) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      current.ddTeam = i;
      ddWager.max = maxDailyDoubleWager(i);
      ddHint.textContent = `Mellom 5 og ${ddWager.max} poeng.`;
      renderDailyDoubleTeams();
      ddWager.focus();
    });
    ddTeams.appendChild(btn);
  });
}

// As on TV: up to the team's score, or the highest value on the board if that is more
function maxDailyDoubleWager(teamIndex) {
  return Math.max(scores[teamIndex], highestBoardValue());
}

function confirmDailyDouble() {
  if (current.ddTeam === null) {
    ddHint.textContent = "Velg hvilket lag som valgte ruten.";
    return;
  }
  const max = maxDailyDoubleWager(current.ddTeam);
  const wager = parseInt(ddWager.value, 10);
  if (Number.isNaN(wager) || wager < 5 || wager > max) {
    ddHint.textContent = `Innsatsen må være mellom 5 og ${max} poeng.`;
    return;
  }

  current.points = wager;
  current.allowedTeams = [current.ddTeam];
  modalCategory.textContent =
    `${current.category.name} – Daily Double: ${teams[current.ddTeam]} satser ${wager}`;
  showQuestion();
}

ddStartBtn.addEventListener("click", confirmDailyDouble);
ddWager.addEventListener("keydown", (e) => {
  if (e.key === "Enter") confirmDailyDouble();
});

// Keyboard: space shows the answer, Escape closes
document.addEventListener("keydown", (e) => {
  if (modal.classList.contains("hidden") || questionStage.classList.contains("hidden")) return;
  if (e.target.tagName === "INPUT") return;
  if (e.key === " ") {
    e.preventDefault();
    revealAnswer();
  } else if (e.key === "Escape") {
    closeQuestion();
  }
});
