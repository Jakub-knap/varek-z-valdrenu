const SAVE_KEY = "vn_save_v1";

const bgLayer   = document.getElementById("bg-layer");
const charImg   = document.getElementById("char-img");
const speakerEl = document.getElementById("speaker");
const dialogueEl= document.getElementById("dialogue");
const nextBtn   = document.getElementById("next-btn");
const choicesEl = document.getElementById("choices");

let story = null;
let state = {
  sceneId: null,
  lineIndex: 0
};

const titleScreen  = document.getElementById("title-screen");
const btnContinue  = document.getElementById("btn-continue");
const btnNewGame   = document.getElementById("btn-newgame");

async function loadStory() {
  const res = await fetch("story/story.json");
  story = await res.json();

  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    btnContinue.style.display = "block";
  }
}

function startNewGame() {
  localStorage.removeItem(SAVE_KEY);
  state.sceneId = story.start;
  state.lineIndex = 0;
  hideTitle();
  renderScene(state.sceneId, true);
}

function continueGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  state = JSON.parse(saved);
  hideTitle();
  const scene = story.scenes[state.sceneId];
  setBackground(scene.bg);
  showLine();
}

function hideTitle() {
  titleScreen.classList.add("hidden");
}

btnNewGame.addEventListener("click", startNewGame);
btnContinue.addEventListener("click", continueGame);

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function setBackground(src) {
  // fade out, swap image, fade in
  bgLayer.classList.add("fading");
  setTimeout(() => {
    bgLayer.style.backgroundImage = `url('${src}')`;
    bgLayer.classList.remove("fading");
  }, 400);
}

function renderScene(sceneId, isNewScene) {
  const scene = story.scenes[sceneId];
  if (!scene) {
    console.error("Neexistujúca scéna:", sceneId);
    return;
  }
  state.sceneId = sceneId;
  if (isNewScene) {
    state.lineIndex = 0;
    setBackground(scene.bg);
  }
  showLine();
}

function showLine() {
  const scene = story.scenes[state.sceneId];
  const line = scene.lines[state.lineIndex];

  choicesEl.innerHTML = "";
  choicesEl.style.display = "none";
  nextBtn.style.display = "inline-block";

  speakerEl.textContent = line.speaker || "";
  dialogueEl.textContent = line.text;

  updateCharacter(line.char || null);

  saveGame();
}

function updateCharacter(src) {
  if (!src) {
    charImg.classList.remove("visible");
    return;
  }
  if (charImg.getAttribute("src") !== src) {
    charImg.classList.remove("visible");
    setTimeout(() => {
      charImg.src = src;
      charImg.classList.add("visible");
    }, 150);
  } else {
    charImg.classList.add("visible");
  }
}

function advance() {
  const scene = story.scenes[state.sceneId];

  if (state.lineIndex < scene.lines.length - 1) {
    state.lineIndex++;
    showLine();
  } else {
    showChoices();
  }
}

function showChoices() {
  const scene = story.scenes[state.sceneId];
  nextBtn.style.display = "none";

  if (!scene.choices || scene.choices.length === 0) {
    // koniec vetvy / hry - dá sa tu napojiť "koniec kapitoly" obrazovka
    dialogueEl.textContent += "\n\n[Koniec]";
    return;
  }

  choicesEl.style.display = "flex";
  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => renderScene(choice.next, true));
    choicesEl.appendChild(btn);
  });
}

nextBtn.addEventListener("click", advance);
document.getElementById("textbox").addEventListener("click", (e) => {
  if (e.target.id !== "next-btn") advance();
});

loadStory();

// PWA service worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
