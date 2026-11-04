// Start screen: choose teams and which features to use, then start the game.

const MAX_TEAMS = 8;
const defaults = GAME.settings || {};

const setupScreen = document.getElementById("setup");
const teamCountSelect = document.getElementById("team-count");
const teamNamesEl = document.getElementById("team-names");
const timerCheck = document.getElementById("opt-timer");
const timerSecondsInput = document.getElementById("opt-timer-seconds");
const ddCheck = document.getElementById("opt-dd");
const ddCountInput = document.getElementById("opt-dd-count");
const finalCheck = document.getElementById("opt-final");
const finalNote = document.getElementById("opt-final-note");

function setupForm() {
  document.getElementById("setup-title").textContent = GAME.title;
  document.title = GAME.title;

  for (let n = 1; n <= MAX_TEAMS; n++) {
    teamCountSelect.add(new Option(n, n));
  }
  teamCountSelect.value = Math.min(Math.max(GAME.teams.length, 1), MAX_TEAMS);
  teamCountSelect.addEventListener("change", renderTeamInputs);
  renderTeamInputs();

  timerCheck.checked = Boolean(defaults.timer);
  timerSecondsInput.value = defaults.timerSeconds || 30;
  ddCheck.checked = Boolean(defaults.dailyDouble);
  ddCountInput.value = defaults.dailyDoubleCount || 1;

  // The final round can only be chosen if it is filled in in questions.js
  if (GAME.finalRound && GAME.finalRound.question) {
    finalCheck.checked = Boolean(defaults.finalRound);
    finalNote.textContent = `Kategori: ${GAME.finalRound.category}`;
  } else {
    finalCheck.checked = false;
    finalCheck.disabled = true;
    finalNote.textContent = "Ingen finale i questions.js";
  }

  for (const check of [timerCheck, ddCheck]) {
    check.addEventListener("change", updateExtras);
  }
  updateExtras();

  document.getElementById("start-btn").addEventListener("click", start);
}

// Keep names that are already typed in when the number of teams changes
function renderTeamInputs() {
  const typed = [...teamNamesEl.querySelectorAll("input")].map((input) => input.value);
  const count = Number(teamCountSelect.value);

  teamNamesEl.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "team-name-input";
    input.placeholder = `Lag ${i + 1}`;
    input.value = typed[i] ?? GAME.teams[i] ?? `Lag ${i + 1}`;
    teamNamesEl.appendChild(input);
  }
}

function updateExtras() {
  timerSecondsInput.disabled = !timerCheck.checked;
  ddCountInput.disabled = !ddCheck.checked;
}

function readNumber(input, min, max, fallback) {
  const value = parseInt(input.value, 10);
  if (Number.isNaN(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

function start() {
  const names = [...teamNamesEl.querySelectorAll("input")].map(
    (input, i) => input.value.trim() || `Lag ${i + 1}`
  );

  const chosen = {
    timer: timerCheck.checked,
    timerSeconds: readNumber(timerSecondsInput, 5, 300, 30),
    dailyDouble: ddCheck.checked,
    dailyDoubleCount: readNumber(ddCountInput, 1, 5, 1),
    finalRound: finalCheck.checked,
  };

  setupScreen.classList.add("hidden");
  startGame(names, chosen);
}

setupForm();
