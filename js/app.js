/* ============================================================
   app.js — Lógica principal do SPA
   ============================================================ */

/* ---------------- tela cheia (funciona direto no navegador, sem instalar nada) ---------------- */
function updateFullscreenBtn() {
  const btn = document.getElementById("btn-fullscreen");
  if (!btn) return;
  btn.textContent = document.fullscreenElement ? "⤢" : "⛶";
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (e) {
    console.warn("Tela cheia não suportada aqui:", e);
    showToast("Seu navegador não permite tela cheia automática — tente instalar o app pela tela inicial.", "ℹ️");
  }
}
document.addEventListener("fullscreenchange", updateFullscreenBtn);
document.getElementById("btn-fullscreen").addEventListener("click", toggleFullscreen);

/* ---------------- botão de som (efeitos) ---------------- */
function updateSfxBtn() {
  document.getElementById("btn-sfx").textContent = sfxEnabled ? "🔊" : "🔈";
}
document.getElementById("btn-sfx").addEventListener("click", () => {
  toggleSfx();
  updateSfxBtn();
});
updateSfxBtn();

/* ---------------- retorno tátil (vibração leve) ---------------- */
function vibrate(pattern) {
  if (navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (e) { /* ignora */ }
  }
}

/* ---------------- wake lock (impede a tela de apagar durante o estudo) ---------------- */
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch (e) { /* silencioso: alguns navegadores negam sem contexto visível */ }
}
function releaseWakeLock() {
  if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && wakeLock === null) {
    const activeStudyScreens = ["screen-runner", "screen-exam", "screen-feynman"];
    const current = document.querySelector(".screen.is-visible");
    if (current && activeStudyScreens.includes(current.id)) requestWakeLock();
  }
});

const AVATARS = ["🧑‍🚀","🦸","🧙","🥷","🧑‍🎤","🐉","🦊","🐱","🤖","🦄"];

let state = loadState();

/* ---------------- navegação entre telas ---------------- */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("is-visible"));
  document.getElementById(id).classList.add("is-visible");
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.nav === id.replace("screen-", ""));
  });
  window.scrollTo(0, 0);
}

function showToast(msg, icon = "✅") {
  const t = document.getElementById("toast");
  t.textContent = `${icon} ${msg}`;
  t.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove("is-visible"), 2200);
}

function floatXP(amount) {
  const el = document.createElement("div");
  el.className = "xp-float";
  el.textContent = `+${amount} XP`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ---------------- XP / nível central ---------------- */
function addXP(amount) {
  const before = levelFromXP(state.xp).level;
  state.xp += amount;
  const after = levelFromXP(state.xp).level;
  floatXP(amount);
  if (after > before) {
    showToast(`Nível ${after} alcançado!`, "⭐");
    sfxLevelUp();
    showLevelUpOverlay(after);
    if (after >= 5) {
      const b = grantBadge(state, "level_5");
      if (b) showToast(b.label, b.icon);
    }
  }
  saveState(state);
}

/* ================= ONBOARDING ================= */
function initOnboarding() {
  const picker = document.getElementById("avatar-picker");
  picker.innerHTML = "";
  let selected = AVATARS[0];
  AVATARS.forEach((emoji, i) => {
    const btn = document.createElement("div");
    btn.className = "avatar-opt" + (i === 0 ? " is-selected" : "");
    btn.textContent = emoji;
    btn.addEventListener("click", () => {
      selected = emoji;
      picker.querySelectorAll(".avatar-opt").forEach((o) => o.classList.remove("is-selected"));
      btn.classList.add("is-selected");
    });
    picker.appendChild(btn);
  });

  document.getElementById("btn-start").addEventListener("click", () => {
    const nameInput = document.getElementById("input-name");
    const name = nameInput.value.trim() || "Aventureiro";
    state.profile.name = name;
    state.profile.avatar = selected;
    state.profile.createdAt = todayISO();
    registerStudyToday(state);
    saveState(state);
    renderHome();
    showScreen("screen-home");
  });
}

/* ================= HOME ================= */
let selectedSubjectId = null;

function renderSubjectTabs() {
  const wrap = document.getElementById("subject-tabs");
  wrap.innerHTML = "";
  if (!selectedSubjectId) selectedSubjectId = QUEST_DATA.subjects[0].id;
  if (QUEST_DATA.subjects.length <= 1) {
    wrap.classList.add("hidden");
    return;
  }
  wrap.classList.remove("hidden");
  QUEST_DATA.subjects.forEach((subject) => {
    const btn = document.createElement("button");
    btn.className = "subject-tab" + (subject.id === selectedSubjectId ? " is-active" : "");
    btn.innerHTML = `<span>${subject.icon}</span> ${subject.name}`;
    btn.addEventListener("click", () => {
      selectedSubjectId = subject.id;
      renderSubjectTabs();
      renderTrail();
    });
    wrap.appendChild(btn);
  });
}

function renderTrail() {
  const trail = document.getElementById("trail");
  trail.innerHTML = "";
  const subject = QUEST_DATA.subjects.find((s) => s.id === selectedSubjectId) || QUEST_DATA.subjects[0];
  const steps = subjectStepsWithStatus(subject, state);

  subject.fases.forEach((fase) => {
    const faseSteps = steps.filter((s) => s.fase.id === fase.id);
    const faseDone = faseSteps.every((s) => s.status === "done");
    const faseLocked = faseSteps.every((s) => s.status === "locked");

    const wrap = document.createElement("div");
    wrap.className = "trail-subject";
    wrap.innerHTML = `<div class="trail-subject-head">${fase.title}${faseDone ? " ✅" : ""}</div>`;
    const row = document.createElement("div");
    row.className = "trail-row" + (faseLocked ? " is-fase-locked" : "");

    faseSteps.forEach((step, i) => {
      const node = document.createElement("div");
      const isRecap = step.type === "recap";
      node.className = "trail-node is-" + step.status + (isRecap ? " is-recap" : "");
      node.innerHTML = step.status === "done" ? "✓" : isRecap ? "📝" : (i + 1);
      node.title = isRecap ? "Recapitulação" : step.mission.title;
      const label = document.createElement("div");
      label.className = "trail-node-label";
      label.textContent = isRecap ? "Recapitulação" : step.mission.title;
      node.appendChild(label);

      if (step.status !== "locked") {
        node.addEventListener("click", () => {
          if (isRecap) startRecap(subject, fase);
          else startMission(subject, step.mission);
        });
      }
      row.appendChild(node);
      if (i < faseSteps.length - 1) {
        const conn = document.createElement("div");
        conn.className = "trail-connector" + (step.status === "done" ? " is-done" : "");
        row.appendChild(conn);
      }
    });
    wrap.appendChild(row);
    trail.appendChild(wrap);
  });
}

function renderHome() {
  document.getElementById("home-avatar").textContent = state.profile.avatar;
  document.getElementById("home-name").textContent = state.profile.name;
  const lv = levelFromXP(state.xp);
  document.getElementById("home-level").textContent = `Nível ${lv.level}`;
  document.getElementById("home-streak").textContent = state.streak;
  document.getElementById("xp-fill").style.width = Math.round((lv.into / lv.need) * 100) + "%";
  document.getElementById("xp-label").textContent = `${lv.into} / ${lv.need} XP`;
  renderSubjectTabs();
  renderTrail();

  const allEx = collectAllExercises();
  const dueCount = allEx.filter((ex) => getBox(state, ex.id) < 3).length;
  document.getElementById("review-count").textContent = dueCount;
}

/* vai direto para a Home (as curiosidades diárias foram removidas deste app) */
function goHome() {
  renderHome();
  showScreen("screen-home");
}

/* ================= RUNNER (missão / revisão) ================= */
const runner = {
  mode: null, // 'mission' | 'review' | 'recap'
  mission: null,
  subject: null,
  fase: null,
  queue: [],
  index: 0,
  correct: 0,
  wrong: 0,
  hearts: 3,
  sessionXP: 0,
  combo: 0,
  orderState: [],
  currentAnswered: false,
};

function startMission(subject, mission) {
  runner.mode = "mission";
  runner.mission = mission;
  runner.subject = subject;
  runner.queue = mission.exercises.slice();
  runner.index = 0;
  runner.correct = 0;
  runner.wrong = 0;
  runner.hearts = 3;
  runner.sessionXP = 0;
  runner.combo = 0;
  updateComboBadge(0);

  document.getElementById("runner-intro-icon").textContent = subject.icon;
  document.getElementById("runner-intro-title").textContent = mission.title;
  document.getElementById("runner-intro-text").innerHTML = mission.explanation;
  document.getElementById("runner-intro").classList.remove("hidden");
  document.getElementById("runner-quiz").classList.add("hidden");
  document.getElementById("runner-summary").classList.add("hidden");
  document.getElementById("runner-hearts").textContent = "❤️❤️❤️";
  document.getElementById("runner-session-xp").textContent = "✨ 0 XP nesta sessão";
  updateRunnerProgress();
  showScreen("screen-runner");
}

function startReview() {
  const allEx = collectAllExercises();
  const queue = buildReviewQueue(state, allEx, 10);
  if (queue.length === 0) {
    showToast("Nada para revisar agora — vá estudar novas missões!", "🎉");
    return;
  }
  runner.mode = "review";
  runner.mission = null;
  runner.subject = null;
  runner.queue = queue;
  runner.index = 0;
  runner.correct = 0;
  runner.wrong = 0;
  runner.hearts = 3;
  runner.sessionXP = 0;
  runner.combo = 0;
  updateComboBadge(0);

  document.getElementById("runner-intro-icon").textContent = "🔁";
  document.getElementById("runner-intro-title").textContent = "Revisão Inteligente";
  document.getElementById("runner-intro-text").textContent =
    "Estas são as perguntas que mais precisam da sua atenção agora — as que você errou aparecem com mais frequência, até você dominá-las de vez.";
  document.getElementById("runner-intro").classList.remove("hidden");
  document.getElementById("runner-quiz").classList.add("hidden");
  document.getElementById("runner-summary").classList.add("hidden");
  document.getElementById("runner-hearts").textContent = "❤️❤️❤️";
  document.getElementById("runner-session-xp").textContent = "✨ 0 XP nesta sessão";
  updateRunnerProgress();
  showScreen("screen-runner");
}

function startRecap(subject, fase) {
  const queue = buildFaseRecap(fase, 8);
  runner.mode = "recap";
  runner.mission = null;
  runner.subject = subject;
  runner.fase = fase;
  runner.queue = queue;
  runner.index = 0;
  runner.correct = 0;
  runner.wrong = 0;
  runner.hearts = 3;
  runner.sessionXP = 0;
  runner.combo = 0;
  updateComboBadge(0);

  document.getElementById("runner-intro-icon").textContent = "📝";
  document.getElementById("runner-intro-title").textContent = "Recapitulação: " + fase.title;
  document.getElementById("runner-intro-text").innerHTML =
    "Vamos revisar tudo que você aprendeu nesta fase! Complete para liberar a próxima fase e ganhar um <b>bônus extra de +100 XP</b>. 🎁";
  document.getElementById("runner-intro").classList.remove("hidden");
  document.getElementById("runner-quiz").classList.add("hidden");
  document.getElementById("runner-summary").classList.add("hidden");
  document.getElementById("runner-hearts").textContent = "❤️❤️❤️";
  document.getElementById("runner-session-xp").textContent = "✨ 0 XP nesta sessão";
  updateRunnerProgress();
  showScreen("screen-runner");
}

function updateRunnerProgress() {
  const pct = runner.queue.length ? (runner.index / runner.queue.length) * 100 : 0;
  document.getElementById("runner-progress-fill").style.width = pct + "%";
}

document.getElementById("btn-runner-begin").addEventListener("click", () => {
  document.getElementById("runner-intro").classList.add("hidden");
  document.getElementById("runner-quiz").classList.remove("hidden");
  requestWakeLock();
  renderRunnerQuestion();
});

function renderRunnerQuestion() {
  const ex = runner.queue[runner.index];
  runner.currentAnswered = false;

  // avatar neutro a cada nova pergunta
  setNurseExpression("idle");

  // contexto entre aspas (texto curto de apoio)
  const ctx = document.getElementById("runner-context");
  ctx.textContent = ex.text || "";
  ctx.style.display = ex.text ? "block" : "none";

  // cenário / caso (bloco destacado tipo "situação do dia a dia")
  const scen = document.getElementById("runner-scenario");
  if (ex.scenario) {
    scen.innerHTML = `<span class="scenario-tag">🩺 Situação</span> ${ex.scenario}`;
    scen.classList.remove("hidden");
  } else {
    scen.classList.add("hidden");
  }

  document.getElementById("runner-question").textContent = ex.q;

  const optsWrap = document.getElementById("runner-options");
  const orderWrap = document.getElementById("runner-order");
  const matchWrap = document.getElementById("runner-match");
  const textInput = document.getElementById("runner-text-input");
  optsWrap.innerHTML = "";
  orderWrap.innerHTML = "";
  matchWrap.innerHTML = "";
  optsWrap.classList.add("hidden");
  orderWrap.classList.add("hidden");
  matchWrap.classList.add("hidden");
  textInput.classList.add("hidden");
  delete optsWrap.dataset.picked;

  document.getElementById("runner-feedback").classList.add("hidden");
  document.getElementById("btn-runner-check").classList.remove("hidden");
  document.getElementById("btn-runner-next").classList.add("hidden");

  if (ex.type === "mc" || ex.type === "truefalse") {
    const options = ex.type === "truefalse" ? ["✅ Verdadeiro", "❌ Falso"] : ex.options;
    optsWrap.classList.remove("hidden");
    options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = opt;
      b.dataset.idx = i;
      b.addEventListener("click", () => {
        optsWrap.querySelectorAll(".opt-btn").forEach((o) => o.classList.remove("is-picked"));
        b.classList.add("is-picked");
        optsWrap.dataset.picked = i;
        vibrate(12);
      });
      optsWrap.appendChild(b);
    });
  } else if (ex.type === "order") {
    // ordenar etapas: lista com botões ↑ ↓
    orderWrap.classList.remove("hidden");
    runner.orderState = shuffleArray(ex.items.map((label, i) => ({ label, origIdx: i })));
    renderOrderList();
  } else if (ex.type === "match") {
    // associação: cada item da esquerda tem um <select> com as opções da direita
    matchWrap.classList.remove("hidden");
    const rightOpts = shuffleArray(ex.pairs.map((p, i) => ({ label: p.right, idx: i })));
    ex.pairs.forEach((pair, i) => {
      const row = document.createElement("div");
      row.className = "match-row";
      const left = document.createElement("div");
      left.className = "match-left";
      left.textContent = pair.left;
      const sel = document.createElement("select");
      sel.className = "match-select";
      sel.dataset.leftIdx = i;
      const blank = document.createElement("option");
      blank.value = ""; blank.textContent = "— escolha —";
      sel.appendChild(blank);
      rightOpts.forEach((r) => {
        const o = document.createElement("option");
        o.value = r.idx; o.textContent = r.label;
        sel.appendChild(o);
      });
      row.appendChild(left);
      row.appendChild(sel);
      matchWrap.appendChild(row);
    });
  } else {
    // text
    textInput.classList.remove("hidden");
    textInput.disabled = false;
    textInput.value = "";
  }
  updateRunnerProgress();
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderOrderList() {
  const orderWrap = document.getElementById("runner-order");
  orderWrap.innerHTML = "";
  runner.orderState.forEach((item, pos) => {
    const row = document.createElement("div");
    row.className = "order-row";
    const num = document.createElement("span");
    num.className = "order-num";
    num.textContent = pos + 1;
    const label = document.createElement("span");
    label.className = "order-label";
    label.textContent = item.label;
    const controls = document.createElement("div");
    controls.className = "order-controls";
    const up = document.createElement("button");
    up.className = "order-btn"; up.textContent = "▲"; up.disabled = pos === 0;
    up.addEventListener("click", () => { moveOrderItem(pos, -1); });
    const down = document.createElement("button");
    down.className = "order-btn"; down.textContent = "▼"; down.disabled = pos === runner.orderState.length - 1;
    down.addEventListener("click", () => { moveOrderItem(pos, 1); });
    controls.appendChild(up); controls.appendChild(down);
    row.appendChild(num); row.appendChild(label); row.appendChild(controls);
    orderWrap.appendChild(row);
  });
}

function moveOrderItem(pos, dir) {
  const target = pos + dir;
  if (target < 0 || target >= runner.orderState.length) return;
  const arr = runner.orderState;
  [arr[pos], arr[target]] = [arr[target], arr[pos]];
  vibrate(10);
  renderOrderList();
}

function checkTextAnswer(ex, value) {
  const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, "");
  const candidates = [ex.answer, ...(ex.altAnswers || [])].map(norm);
  return candidates.includes(norm(value));
}

document.getElementById("btn-runner-check").addEventListener("click", () => {
  if (runner.currentAnswered) return;
  const ex = runner.queue[runner.index];
  let correct = false;

  if (ex.type === "mc" || ex.type === "truefalse") {
    const optsWrap = document.getElementById("runner-options");
    const picked = optsWrap.dataset.picked;
    if (picked === undefined) {
      showToast("Escolha uma alternativa primeiro!", "👆");
      return;
    }
    const answerIdx = ex.type === "truefalse" ? (ex.answer === true ? 0 : 1) : ex.answer;
    correct = Number(picked) === answerIdx;
    optsWrap.querySelectorAll(".opt-btn").forEach((o, i) => {
      o.disabled = true;
      if (i === answerIdx) o.classList.add("is-correct");
      else if (i === Number(picked) && !correct) o.classList.add("is-wrong");
    });
  } else if (ex.type === "order") {
    correct = runner.orderState.every((item, pos) => item.origIdx === pos);
    document.querySelectorAll("#runner-order .order-btn").forEach((b) => (b.disabled = true));
  } else if (ex.type === "match") {
    const selects = document.querySelectorAll("#runner-match .match-select");
    correct = true;
    selects.forEach((sel) => {
      const leftIdx = Number(sel.dataset.leftIdx);
      if (Number(sel.value) !== leftIdx) correct = false;
      sel.disabled = true;
      sel.classList.add(Number(sel.value) === leftIdx ? "match-ok" : "match-bad");
    });
    if ([...selects].some((s) => s.value === "")) {
      selects.forEach((s) => { s.disabled = false; s.classList.remove("match-ok", "match-bad"); });
      showToast("Complete todas as associações!", "👆");
      return;
    }
  } else {
    const val = document.getElementById("runner-text-input").value;
    if (!val.trim()) {
      showToast("Digite sua resposta!", "👆");
      return;
    }
    correct = checkTextAnswer(ex, val);
    document.getElementById("runner-text-input").disabled = true;
  }

  runner.currentAnswered = true;
  answerExercise(state, ex.id, correct);

  const sparkleOrigin = (ex.type === "mc" || ex.type === "truefalse")
    ? document.querySelector("#runner-options .opt-btn.is-correct")
    : document.getElementById("btn-runner-check");

  const fb = document.getElementById("runner-feedback");
  fb.classList.remove("hidden", "ok", "bad");
  if (correct) {
    runner.correct++;
    fb.classList.add("ok");
    fb.textContent = ex.explain ? "✅ Isso aí! " + ex.explain : "✅ Isso aí! Resposta certa.";
    vibrate(35);
    sfxCorrect();
    sparkleFromElement(sparkleOrigin);
    setNurseExpression("happy", 2500);
    runner.combo++;
    updateComboBadge(runner.combo);
    addXP(15);
    runner.sessionXP += 15;
  } else {
    runner.wrong++;
    runner.combo = 0;
    updateComboBadge(0);
    runner.hearts = Math.max(0, runner.hearts - 1);
    document.getElementById("runner-hearts").textContent = "❤️".repeat(runner.hearts) || "💔";
    fb.classList.add("bad");
    fb.textContent = `❌ ${answerReveal(ex)} ${ex.explain ? "— " + ex.explain : (ex.hint ? "💡 " + ex.hint : "")}`;
    vibrate([30, 60, 30]);
    sfxWrong();
    setNurseExpression("sad", 2500);
    addXP(3);
    runner.sessionXP += 3;
  }
  document.getElementById("runner-session-xp").textContent = `✨ ${runner.sessionXP} XP nesta sessão`;
  saveState(state);
  document.getElementById("btn-runner-check").classList.add("hidden");
  document.getElementById("btn-runner-next").classList.remove("hidden");
});

/* texto de "resposta certa" para o feedback de erro, conforme o tipo */
function answerReveal(ex) {
  if (ex.type === "mc") return "A resposta certa é: " + ex.options[ex.answer] + ".";
  if (ex.type === "truefalse") return "A resposta certa é: " + (ex.answer ? "Verdadeiro" : "Falso") + ".";
  if (ex.type === "order") return "A ordem correta era: " + ex.items.join(" → ") + ".";
  if (ex.type === "match") return "Confira as associações corretas destacadas.";
  return "A resposta certa é: " + ex.answer + ".";
}

document.getElementById("btn-runner-next").addEventListener("click", () => {
  runner.index++;
  if (runner.index >= runner.queue.length) {
    finishRunner();
  } else {
    renderRunnerQuestion();
  }
});

function finishRunner() {
  releaseWakeLock();
  document.getElementById("runner-quiz").classList.add("hidden");
  document.getElementById("runner-summary").classList.remove("hidden");
  updateRunnerProgress();

  if (runner.mode === "mission") {
    if (!state.completedMissions.includes(runner.mission.id)) {
      state.completedMissions.push(runner.mission.id);
      if (state.completedMissions.length === 1) {
        const b = grantBadge(state, "first_mission");
        if (b) setTimeout(() => showToast(b.label, b.icon), 400);
      }
    }
  } else if (runner.mode === "recap") {
    const recapId = runner.fase.id + "-recap";
    if (!state.completedRecaps.includes(recapId)) {
      state.completedRecaps.push(recapId);
      addXP(100);
      runner.sessionXP += 100;
      if (state.completedRecaps.length === 1) {
        const b = grantBadge(state, "first_fase");
        if (b) setTimeout(() => showToast(b.label, b.icon), 900);
      }
      setTimeout(() => showToast("Bônus de fase: +100 XP! 🎁", "🎉"), 500);
      fireConfetti(60, 1800);
    }
  }
  registerStudyToday(state);
  checkStreakBadges();
  saveState(state);
  sfxComplete();

  const xpGainedThisSession = runner.sessionXP;
  const lv = levelFromXP(state.xp);
  const modeLabel = runner.mode === "mission" ? "Missão" : runner.mode === "recap" ? "Recapitulação" : "Revisão";
  const titleLabel = runner.mode === "mission" ? runner.mission.title : runner.mode === "recap" ? runner.fase.title : "Revisão inteligente";
  sendSessionReport({
    studentName: state.profile.name,
    mode: modeLabel,
    title: titleLabel,
    correct: runner.correct,
    wrong: runner.wrong,
    xpGained: xpGainedThisSession,
    totalXp: state.xp,
    level: lv.level,
    streak: state.streak,
  });

  document.getElementById("runner-summary-stats").innerHTML = `
    <div class="summary-stat"><div class="summary-stat-num">${runner.correct}</div><div class="summary-stat-label">Acertos</div></div>
    <div class="summary-stat"><div class="summary-stat-num">${runner.wrong}</div><div class="summary-stat-label">Erros</div></div>
    <div class="summary-stat"><div class="summary-stat-num">${xpGainedThisSession}</div><div class="summary-stat-label">XP ganho</div></div>
  `;
}

function checkStreakBadges() {
  if (state.streak >= 3) {
    const b = grantBadge(state, "streak_3");
    if (b) setTimeout(() => showToast(b.label, b.icon), 800);
  }
  if (state.streak >= 7) {
    const b = grantBadge(state, "streak_7");
    if (b) setTimeout(() => showToast(b.label, b.icon), 800);
  }
}

document.getElementById("btn-runner-finish").addEventListener("click", () => {
  goHome();
});

document.getElementById("btn-exit-runner").addEventListener("click", () => {
  if (runner.index > 0 && runner.index < runner.queue.length) {
    if (!confirm("Sair agora? O progresso desta sessão não será salvo.")) return;
  }
  releaseWakeLock();
  goHome();
});

/* ================= EXAM MODE ================= */
const exam = {
  queue: [],
  index: 0,
  answers: [],
  timer: null,
  secondsLeft: 300,
};

document.getElementById("btn-exam").addEventListener("click", () => {
  document.getElementById("exam-intro").classList.remove("hidden");
  document.getElementById("exam-quiz").classList.add("hidden");
  document.getElementById("exam-result").classList.add("hidden");
  document.getElementById("exam-timer").textContent = "05:00";
  showScreen("screen-exam");
});

document.getElementById("btn-exam-begin").addEventListener("click", () => {
  const all = collectAllExercises().filter((e) => e.type === "mc" || e.type === "truefalse" || e.type === "text");
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  exam.queue = all.slice(0, Math.min(10, all.length));
  exam.index = 0;
  exam.answers = [];
  exam.secondsLeft = 300;

  document.getElementById("exam-intro").classList.add("hidden");
  document.getElementById("exam-quiz").classList.remove("hidden");
  requestWakeLock();
  renderExamQuestion();

  clearInterval(exam.timer);
  exam.timer = setInterval(() => {
    exam.secondsLeft--;
    const m = String(Math.floor(exam.secondsLeft / 60)).padStart(2, "0");
    const s = String(exam.secondsLeft % 60).padStart(2, "0");
    document.getElementById("exam-timer").textContent = `${m}:${s}`;
    if (exam.secondsLeft <= 0) {
      clearInterval(exam.timer);
      finalizeExam();
    }
  }, 1000);
});

function renderExamQuestion() {
  const ex = exam.queue[exam.index];
  const ctx = document.getElementById("exam-context");
  ctx.textContent = ex.text || "";
  ctx.style.display = ex.text ? "block" : "none";
  document.getElementById("exam-question").textContent = ex.q;

  const optsWrap = document.getElementById("exam-options");
  const textInput = document.getElementById("exam-text-input");
  optsWrap.innerHTML = "";
  delete optsWrap.dataset.picked;

  if (ex.type === "mc" || ex.type === "truefalse") {
    const options = ex.type === "truefalse" ? ["✅ Verdadeiro", "❌ Falso"] : ex.options;
    textInput.classList.add("hidden");
    optsWrap.classList.remove("hidden");
    options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = opt;
      b.addEventListener("click", () => {
        optsWrap.querySelectorAll(".opt-btn").forEach((o) => o.classList.remove("is-picked"));
        b.classList.add("is-picked");
        optsWrap.dataset.picked = i;
        vibrate(12);
      });
      optsWrap.appendChild(b);
    });
  } else {
    optsWrap.classList.add("hidden");
    textInput.classList.remove("hidden");
    textInput.value = "";
  }
  document.getElementById("exam-progress-fill").style.width = (exam.index / exam.queue.length) * 100 + "%";
}

document.getElementById("btn-exam-next").addEventListener("click", () => {
  const ex = exam.queue[exam.index];
  let userAnswer = null;
  if (ex.type === "mc" || ex.type === "truefalse") {
    const picked = document.getElementById("exam-options").dataset.picked;
    userAnswer = picked !== undefined ? Number(picked) : null;
  } else {
    userAnswer = document.getElementById("exam-text-input").value || null;
  }
  exam.answers.push(userAnswer);
  exam.index++;
  if (exam.index >= exam.queue.length) {
    clearInterval(exam.timer);
    finalizeExam();
  } else {
    renderExamQuestion();
  }
});

function finalizeExam() {
  clearInterval(exam.timer);
  releaseWakeLock();
  // preenche respostas faltantes (tempo esgotado)
  while (exam.answers.length < exam.queue.length) exam.answers.push(null);

  let correctCount = 0;
  const reviewHTML = exam.queue.map((ex, i) => {
    const userAns = exam.answers[i];
    let isCorrect;
    let userLabel, correctLabel;
    if (ex.type === "mc") {
      isCorrect = userAns === ex.answer;
      userLabel = userAns === null ? "(não respondida)" : ex.options[userAns];
      correctLabel = ex.options[ex.answer];
    } else if (ex.type === "truefalse") {
      const answerIdx = ex.answer ? 0 : 1;
      const labels = ["Verdadeiro", "Falso"];
      isCorrect = userAns === answerIdx;
      userLabel = userAns === null ? "(não respondida)" : labels[userAns];
      correctLabel = labels[answerIdx];
    } else {
      isCorrect = userAns !== null && checkTextAnswer(ex, userAns);
      userLabel = userAns || "(não respondida)";
      correctLabel = ex.answer;
    }
    if (isCorrect) correctCount++;
    return `<div class="exam-review-item ${isCorrect ? "right" : "wrong"}">
      <b>${ex.q}</b><br>Sua resposta: ${userLabel}${isCorrect ? "" : `<br>Resposta certa: ${correctLabel}`}
    </div>`;
  }).join("");

  document.getElementById("exam-quiz").classList.add("hidden");
  document.getElementById("exam-result").classList.remove("hidden");
  document.getElementById("exam-score").textContent = `${correctCount}/${exam.queue.length}`;
  document.getElementById("exam-review").innerHTML = reviewHTML;

  const xpGain = correctCount * 20;
  addXP(xpGain);
  registerStudyToday(state);
  sfxComplete();
  if (correctCount === exam.queue.length) {
    const b = grantBadge(state, "prova_100");
    if (b) setTimeout(() => showToast(b.label, b.icon), 500);
    fireConfetti(60, 1800);
  }
  saveState(state);

  const lv = levelFromXP(state.xp);
  sendSessionReport({
    studentName: state.profile.name,
    mode: "Prova",
    title: "Simulado (10 questões)",
    correct: correctCount,
    wrong: exam.queue.length - correctCount,
    xpGained: xpGain,
    totalXp: state.xp,
    level: lv.level,
    streak: state.streak,
  });
}

document.getElementById("btn-exam-finish").addEventListener("click", () => {
  goHome();
});
document.getElementById("btn-exit-exam").addEventListener("click", () => {
  if (exam.index > 0 && exam.index < exam.queue.length) {
    if (!confirm("Sair da prova agora? O resultado não será salvo.")) return;
  }
  clearInterval(exam.timer);
  releaseWakeLock();
  goHome();
});

/* ================= FEYNMAN MODE ================= */
let feynmanCurrent = null;

document.getElementById("btn-feynman").addEventListener("click", () => {
  renderFeynmanPicker();
  document.getElementById("feynman-picker").classList.remove("hidden");
  document.getElementById("feynman-writer").classList.add("hidden");
  document.getElementById("feynman-feedback").classList.add("hidden");
  showScreen("screen-feynman");
});

function renderFeynmanPicker() {
  const wrap = document.getElementById("feynman-picker");
  wrap.innerHTML = "";
  FEYNMAN_TOPICS.forEach((topic) => {
    const card = document.createElement("div");
    card.className = "feynman-topic-card";
    card.innerHTML = `<b>🧠 ${topic.title}</b><span>${topic.prompt}</span>`;
    card.addEventListener("click", () => {
      feynmanCurrent = topic;
      document.getElementById("feynman-prompt").textContent = topic.prompt;
      document.getElementById("feynman-textarea").value = "";
      document.getElementById("feynman-picker").classList.add("hidden");
      document.getElementById("feynman-writer").classList.remove("hidden");
    });
    wrap.appendChild(card);
  });
}

document.getElementById("btn-feynman-submit").addEventListener("click", () => {
  const text = document.getElementById("feynman-textarea").value.trim();
  if (text.length < 15) {
    showToast("Escreva um pouco mais — capriche na explicação!", "✍️");
    return;
  }
  const lower = text.toLowerCase();
  const found = feynmanCurrent.keywords.filter((k) => lower.includes(k));
  const missing = feynmanCurrent.keywords.filter((k) => !lower.includes(k)).slice(0, 3);

  document.getElementById("feynman-writer").classList.add("hidden");
  document.getElementById("feynman-feedback").classList.remove("hidden");

  let msg = `Você mencionou ${found.length} de ${feynmanCurrent.keywords.length} ideias-chave do assunto. `;
  msg += found.length >= 3
    ? "Muito bem explicado! "
    : "Você já está no caminho certo. ";
  if (missing.length) {
    msg += `<br><br><b>Para deixar ainda mais completo, tente também explicar:</b> ${missing.join(", ")}.`;
  }
  document.getElementById("feynman-feedback-text").innerHTML = msg;

  state.feynmanCount = (state.feynmanCount || 0) + 1;
  addXP(20);
  registerStudyToday(state);
  sfxComplete();
  if (state.feynmanCount >= 5) {
    const b = grantBadge(state, "feynman_5");
    if (b) setTimeout(() => showToast(b.label, b.icon), 500);
  }
  saveState(state);

  const lv = levelFromXP(state.xp);
  sendSessionReport({
    studentName: state.profile.name,
    mode: "Ensine o Sistema",
    title: feynmanCurrent.title,
    correct: found.length,
    wrong: feynmanCurrent.keywords.length - found.length,
    xpGained: 20,
    totalXp: state.xp,
    level: lv.level,
    streak: state.streak,
  });
});

document.getElementById("btn-feynman-finish").addEventListener("click", () => {
  goHome();
});
document.getElementById("btn-exit-feynman").addEventListener("click", () => {
  goHome();
});

/* ================= DAILY TRIVIA (curiosidades do dia) ================= */
function dailyTriviaDue() {
  return state.lastTriviaDate !== todayISO();
}

const trivia = { queue: [], index: 0, correctCount: 0 };

function startDailyTrivia() {
  trivia.queue = pickDailyTrivia(state, 5);
  trivia.index = 0;
  trivia.correctCount = 0;
  saveState(state); // persiste o consumo do triviaCursor
  document.getElementById("trivia-quiz").classList.remove("hidden");
  document.getElementById("trivia-summary").classList.add("hidden");
  renderTriviaQuestion();
  showScreen("screen-trivia");
}

function renderTriviaQuestion() {
  const item = trivia.queue[trivia.index];
  document.getElementById("trivia-progress-fill").style.width = (trivia.index / trivia.queue.length) * 100 + "%";
  document.getElementById("trivia-category").textContent = item.category;
  document.getElementById("trivia-text").textContent = item.text;
  document.getElementById("trivia-feedback").classList.add("hidden");
  document.getElementById("trivia-buttons").classList.remove("hidden");
  document.getElementById("btn-trivia-next").classList.add("hidden");
}

function checkTriviaAnswer(userSaysTrue) {
  const item = trivia.queue[trivia.index];
  const correct = userSaysTrue === item.isTrue;
  if (correct) {
    trivia.correctCount++;
    addXP(8);
    vibrate(35);
    sfxCorrect();
  } else {
    addXP(3);
    vibrate([30, 60, 30]);
    sfxWrong();
  }
  document.getElementById("trivia-buttons").classList.add("hidden");
  const fb = document.getElementById("trivia-feedback");
  fb.classList.remove("hidden", "ok", "bad");
  fb.classList.add(correct ? "ok" : "bad");
  fb.innerHTML = (correct ? "✅ Isso mesmo! " : "❌ Na verdade, não. ") + item.explain;
  document.getElementById("btn-trivia-next").classList.remove("hidden");
  saveState(state);
}
document.getElementById("btn-trivia-true").addEventListener("click", () => checkTriviaAnswer(true));
document.getElementById("btn-trivia-false").addEventListener("click", () => checkTriviaAnswer(false));

document.getElementById("btn-trivia-next").addEventListener("click", () => {
  trivia.index++;
  if (trivia.index >= trivia.queue.length) finishTrivia();
  else renderTriviaQuestion();
});

function finishTrivia() {
  state.lastTriviaDate = todayISO();
  state.triviaCompletedCount = (state.triviaCompletedCount || 0) + 1;
  addXP(15);
  sfxComplete();
  if (state.triviaCompletedCount >= 5) {
    const b = grantBadge(state, "trivia_5");
    if (b) setTimeout(() => showToast(b.label, b.icon), 500);
  }
  saveState(state);
  document.getElementById("trivia-quiz").classList.add("hidden");
  document.getElementById("trivia-summary").classList.remove("hidden");
  document.getElementById("trivia-summary-stats").textContent =
    `Você acertou ${trivia.correctCount} de ${trivia.queue.length}. Sua trilha de estudo já está liberada!`;
}

document.getElementById("btn-trivia-finish").addEventListener("click", () => {
  renderHome();
  showScreen("screen-home");
});
document.getElementById("btn-trivia-skip").addEventListener("click", () => {
  state.lastTriviaDate = todayISO();
  saveState(state);
  renderHome();
  showScreen("screen-home");
});

/* ================= REVIEW quick action ================= */
document.getElementById("btn-review").addEventListener("click", startReview);

/* ================= PROFILE ================= */
const BADGE_ORDER = ["first_mission", "first_fase", "streak_3", "streak_7", "level_5", "prova_100", "feynman_5", "trivia_5"];

function renderProfile() {
  document.getElementById("profile-avatar").textContent = state.profile.avatar;
  document.getElementById("profile-name").textContent = state.profile.name;
  const lv = levelFromXP(state.xp);
  document.getElementById("profile-level").textContent = `Nível ${lv.level}`;
  document.getElementById("stat-xp").textContent = state.xp;
  document.getElementById("stat-streak").textContent = state.streak;
  document.getElementById("stat-missions").textContent = state.completedMissions.length;

  const grid = document.getElementById("badge-grid");
  grid.innerHTML = "";
  BADGE_ORDER.forEach((id) => {
    const def = BADGE_DEFS[id];
    const earned = state.badges.includes(id);
    const item = document.createElement("div");
    item.className = "badge-item" + (earned ? " is-earned" : "");
    item.innerHTML = `<div class="badge-icon">${def.icon}</div><div class="badge-label">${def.label}</div>`;
    grid.appendChild(item);
  });
}

document.getElementById("btn-reset").addEventListener("click", () => {
  if (confirm("Isso vai apagar todo o seu progresso, XP e conquistas. Tem certeza?")) {
    localStorage.removeItem(STORE_KEY);
    location.reload();
  }
});

/* ================= NAV ================= */
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.nav;
    if (target === "home") { goHome(); }
    if (target === "profile") { renderProfile(); showScreen("screen-profile"); }
  });
});

/* ================= INIT ================= */
function init() {
  if (state.profile && state.profile.name) {
    goHome();
  } else {
    initOnboarding();
    showScreen("screen-onboarding");
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch((e) => console.warn("SW falhou:", e));
  }
}

init();
