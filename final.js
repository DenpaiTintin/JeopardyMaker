// Final round and winner screen.

const finalScreen = document.getElementById("final");
const finalContent = document.getElementById("final-content");
let finalWagers = [];
let finalResults = []; // 1 = correct, -1 = wrong, 0 = not marked
let finalTimer = null;

// Step 1: show the category and collect each team's wager
function startFinal() {
  const final = GAME.finalRound;
  finalScreen.style.backgroundImage = final.image ? `url("${final.image}")` : "none";
  finalScreen.classList.remove("hidden");

  finalContent.innerHTML = `
    <div class="final-label">Finalerunde</div>
    <div class="final-category"></div>
    <div class="stage-label">Hvert lag skriver ned innsatsen sin i hemmelighet. Skriv dem inn her:</div>
    <div class="final-teams"></div>
    <div class="hint"></div>
    <div class="modal-buttons"><button class="next-btn">Vis spørsmålet</button></div>
  `;
  finalContent.querySelector(".final-category").textContent = final.category;

  const teamsEl = finalContent.querySelector(".final-teams");
  teams.forEach((name, i) => {
    const max = Math.max(scores[i], 0);
    const row = document.createElement("label");
    row.className = "modal-team";
    row.innerHTML = `<span></span>
      <input type="number" class="wager-input" min="0" max="${max}" value="0" />
      <small>maks ${max}</small>`;
    row.querySelector("span").textContent = name;
    teamsEl.appendChild(row);
  });

  finalContent.querySelector(".next-btn").addEventListener("click", () => {
    const inputs = [...teamsEl.querySelectorAll("input")];
    const hint = finalContent.querySelector(".hint");
    const wagers = inputs.map((input) => parseInt(input.value, 10));

    // A team can wager from 0 up to everything it has
    const invalid = wagers.findIndex((w, i) => Number.isNaN(w) || w < 0 || w > Math.max(scores[i], 0));
    if (invalid !== -1) {
      hint.textContent = `Innsatsen til ${teams[invalid]} må være mellom 0 og ${Math.max(scores[invalid], 0)}.`;
      return;
    }
    finalWagers = wagers;
    finalResults = teams.map(() => 0);
    showFinalQuestion();
  });
}

// Step 2: show the question (with the timer if it is turned on), then the answer
function showFinalQuestion() {
  const final = GAME.finalRound;
  finalContent.innerHTML = `
    <div class="final-label">Finalerunde – <span class="final-category-small"></span></div>
    <div class="timer hidden"></div>
    <div class="final-question"></div>
    <div class="final-answer hidden"></div>
    <div class="final-teams hidden"></div>
    <div class="modal-buttons">
      <button class="reveal-btn">Vis svar</button>
      <button class="winner-btn hidden">Vis vinneren</button>
    </div>
  `;
  finalContent.querySelector(".final-category-small").textContent = final.category;
  finalContent.querySelector(".final-question").textContent = final.question;
  finalContent.querySelector(".final-answer").textContent = final.answer;

  finalTimer = createTimer(finalContent.querySelector(".timer"));
  if (options.timer) finalTimer.start(final.timerSeconds || options.timerSeconds);

  const revealBtn = finalContent.querySelector(".reveal-btn");
  const winnerBtn = finalContent.querySelector(".winner-btn");
  revealBtn.addEventListener("click", () => {
    finalTimer.stop();
    revealBtn.classList.add("hidden");
    winnerBtn.classList.remove("hidden");
    finalContent.querySelector(".final-answer").classList.remove("hidden");
    finalContent.querySelector(".final-teams").classList.remove("hidden");
    renderFinalTeams();
  });
  winnerBtn.addEventListener("click", showWinner);
}

// Step 3: mark each team right or wrong. Several teams can be right here.
function renderFinalTeams() {
  const teamsEl = finalContent.querySelector(".final-teams");
  teamsEl.innerHTML = "";
  teams.forEach((name, i) => {
    const row = document.createElement("div");
    row.className = "modal-team";
    row.innerHTML = `<span></span>
      <small>satset ${finalWagers[i]}</small>
      <button class="btn-right" title="Riktig">+</button>
      <button class="btn-wrong" title="Feil">−</button>`;
    row.querySelector("span").textContent = name;

    const rightBtn = row.querySelector(".btn-right");
    const wrongBtn = row.querySelector(".btn-wrong");
    if (finalResults[i] === 1) rightBtn.classList.add("selected");
    if (finalResults[i] === -1) wrongBtn.classList.add("selected");
    rightBtn.addEventListener("click", () => setFinalResult(i, 1));
    wrongBtn.addEventListener("click", () => setFinalResult(i, -1));
    teamsEl.appendChild(row);
  });
}

function setFinalResult(teamIndex, result) {
  const previous = finalResults[teamIndex];
  const next = previous === result ? 0 : result;
  scores[teamIndex] += (next - previous) * finalWagers[teamIndex];
  finalResults[teamIndex] = next;
  renderFinalTeams();
  renderScores();
}

function showWinner() {
  if (finalTimer) finalTimer.stop();
  finalScreen.style.backgroundImage = `url("${GAME.puzzleImage}")`;
  finalScreen.classList.remove("hidden");

  const best = Math.max(...scores);
  const winners = teams.filter((_, i) => scores[i] === best);
  const ranking = teams
    .map((name, i) => ({ name, score: scores[i] }))
    .sort((a, b) => b.score - a.score);

  finalContent.innerHTML = `
    <div class="final-label">${winners.length > 1 ? "Uavgjort!" : "Vinneren er"}</div>
    <div class="winner-name"></div>
    <ol class="ranking"></ol>
    <div class="modal-buttons"><button class="again-btn">Spill igjen</button></div>
  `;
  finalContent.querySelector(".winner-name").textContent = winners.join(" og ");

  const list = finalContent.querySelector(".ranking");
  for (const { name, score } of ranking) {
    const item = document.createElement("li");
    item.innerHTML = `<span></span><span class="ranking-score">${score}</span>`;
    item.querySelector("span").textContent = name;
    if (score === best) item.classList.add("top");
    list.appendChild(item);
  }

  // Reloading the page goes back to the start screen
  finalContent.querySelector(".again-btn").addEventListener("click", () => location.reload());
}
