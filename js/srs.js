/* ============================================================
   srs.js — Repetição espaçada simplificada (sistema de caixas)
   Caixa 1 = errou recentemente, volta sempre.
   Caixa 2 = acertou uma vez, volta às vezes.
   Caixa 3 = dominado, aparece raramente.
   ============================================================ */

function getBox(state, exerciseId) {
  return state.boxes[exerciseId] || 1;
}

function answerExercise(state, exerciseId, correct) {
  const current = getBox(state, exerciseId);
  if (correct) {
    state.boxes[exerciseId] = Math.min(3, current + 1);
  } else {
    state.boxes[exerciseId] = 1;
  }
  return state;
}

/* Monta uma fila de exercícios para revisão, priorizando caixa 1,
   depois caixa 2, e só raramente caixa 3 (peso menor). */
function buildReviewQueue(state, allExercises, limit = 10) {
  const weighted = [];
  allExercises.forEach((ex) => {
    const box = getBox(state, ex.id);
    const weight = box === 1 ? 3 : box === 2 ? 1 : 0.3;
    const copies = Math.max(1, Math.round(weight * 2));
    for (let i = 0; i < copies; i++) weighted.push(ex);
  });
  // embaralha
  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
  }
  // remove duplicados mantendo ordem, até o limite
  const seen = new Set();
  const queue = [];
  for (const ex of weighted) {
    if (!seen.has(ex.id)) {
      seen.add(ex.id);
      queue.push(ex);
    }
    if (queue.length >= limit) break;
  }
  return queue;
}

function collectAllExercises() {
  const list = [];
  QUEST_DATA.subjects.forEach((subj) => {
    subj.fases.forEach((fase) => {
      fase.missions.forEach((mission) => {
        mission.exercises.forEach((ex) => {
          list.push(Object.assign({ subjectId: subj.id, missionId: mission.id, faseId: fase.id }, ex));
        });
      });
    });
  });
  return list;
}

/* junta todos os exercícios de uma fase específica (usado pela Recapitulação) */
function collectFaseExercises(fase) {
  const list = [];
  fase.missions.forEach((mission) => {
    mission.exercises.forEach((ex) => {
      list.push(Object.assign({ missionId: mission.id, faseId: fase.id }, ex));
    });
  });
  return list;
}

/* monta a fila da Recapitulação de uma fase: embaralha e pega até `limit` exercícios */
function buildFaseRecap(fase, limit = 8) {
  const pool = collectFaseExercises(fase).slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(limit, pool.length));
}

/* sequência linear de "passos" (missões + recap) de uma matéria, usada para
   controlar o desbloqueio progressivo da trilha */
function subjectSteps(subject) {
  const steps = [];
  subject.fases.forEach((fase) => {
    fase.missions.forEach((mission) => {
      steps.push({ type: "mission", fase, mission, id: mission.id });
    });
    steps.push({ type: "recap", fase, id: fase.id + "-recap" });
  });
  return steps;
}

/* status ('done' | 'current' | 'locked') de cada passo, na ordem */
function subjectStepsWithStatus(subject, state) {
  const steps = subjectSteps(subject);
  let foundCurrent = false;
  return steps.map((step) => {
    const done = step.type === "recap"
      ? state.completedRecaps.includes(step.id)
      : state.completedMissions.includes(step.id);
    let status;
    if (done) status = "done";
    else if (!foundCurrent) { status = "current"; foundCurrent = true; }
    else status = "locked";
    return Object.assign({ status }, step);
  });
}

/* ---------------- curiosidades diárias ---------------- */
function pickDailyTrivia(state, count = 5) {
  if (!state.triviaCursor || state.triviaCursor.length < count) {
    const ids = DAILY_TRIVIA.map((t) => t.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    state.triviaCursor = ids;
  }
  const chosenIds = state.triviaCursor.splice(0, count);
  return chosenIds.map((id) => DAILY_TRIVIA.find((t) => t.id === id)).filter(Boolean);
}
