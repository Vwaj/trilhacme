/* ============================================================
   storage.js — Persistência local (localStorage)
   Guarda: perfil do jogador, progresso (caixas de repetição),
   XP, nível, streak e conquistas.
   ============================================================ */

const STORE_KEY = "estudapp_v1";

const DEFAULT_STATE = {
  profile: {
    name: "",
    avatar: "🧑‍🚀",
    createdAt: null,
  },
  xp: 0,
  streak: 0,
  lastStudyDate: null, // ISO date string (yyyy-mm-dd)
  badges: [], // ["first_mission", "streak_3", ...]
  completedMissions: [], // mission ids
  completedRecaps: [], // fase ids whose recap was completed
  boxes: {}, // exerciseId -> box number (1,2,3)
  history: [], // {date, correct, wrong} sessions log (kept short)
  lastTriviaDate: null, // ISO date of last daily-trivia completion
  triviaCursor: [], // shuffled remaining trivia ids for the current cycle
  triviaCompletedCount: 0,
  feynmanCount: 0,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    // merge with defaults to survive future field additions
    return Object.assign(structuredClone(DEFAULT_STATE), parsed);
  } catch (e) {
    console.warn("Falha ao ler storage, iniciando do zero.", e);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Falha ao salvar storage.", e);
  }
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function daysBetween(isoA, isoB) {
  const a = new Date(isoA + "T00:00:00");
  const b = new Date(isoB + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

/* ---- regras de nível ---- */
function levelFromXP(xp) {
  // cada nível pede um pouco mais de XP que o anterior
  let level = 1;
  let need = 100;
  let remaining = xp;
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = Math.round(need * 1.25);
  }
  return { level, into: remaining, need };
}

/* ---- registra estudo do dia (streak) ---- */
function registerStudyToday(state) {
  const today = todayISO();
  if (state.lastStudyDate === today) {
    return state; // já contabilizado hoje
  }
  if (state.lastStudyDate) {
    const gap = daysBetween(state.lastStudyDate, today);
    state.streak = gap === 1 ? state.streak + 1 : 1;
  } else {
    state.streak = 1;
  }
  state.lastStudyDate = today;
  return state;
}

/* ---- badges ---- */
const BADGE_DEFS = {
  first_mission: { icon: "🥇", label: "Primeira missão concluída" },
  streak_3: { icon: "🔥", label: "3 dias seguidos estudando" },
  streak_7: { icon: "🔥🔥", label: "Semana completa de estudo" },
  level_5: { icon: "⭐", label: "Chegou ao nível 5" },
  prova_100: { icon: "🏆", label: "100% em uma prova" },
  feynman_5: { icon: "🧠", label: "5 explicações no Modo Ensine" },
  first_fase: { icon: "🚩", label: "Primeira fase concluída" },
  trivia_5: { icon: "💡", label: "5 dias de curiosidades" },
};

function grantBadge(state, id) {
  if (!state.badges.includes(id)) {
    state.badges.push(id);
    return BADGE_DEFS[id] || null;
  }
  return null;
}
