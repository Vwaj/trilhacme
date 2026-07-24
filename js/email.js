/* ============================================================
   email.js — Envio automático de resumo de sessão por e-mail
   Usa EmailJS (envio direto do navegador, sem precisar de
   servidor próprio). Se não houver internet no momento, o
   resumo fica numa fila local e é reenviado automaticamente
   assim que a conexão voltar.
   ============================================================ */

const EMAIL_QUEUE_KEY = "estudapp_email_queue_v1";
let emailjsReady = false;

function initEmailJS() {
  if (!EMAIL_CONFIG.enabled) return;
  if (typeof emailjs === "undefined") {
    console.warn("EmailJS não carregou (provavelmente sem internet agora) — resumos ficarão na fila.");
    return;
  }
  try {
    emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });
    emailjsReady = true;
  } catch (e) {
    console.warn("Falha ao iniciar EmailJS:", e);
  }
}

function loadEmailQueue() {
  try {
    const raw = localStorage.getItem(EMAIL_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function saveEmailQueue(queue) {
  try { localStorage.setItem(EMAIL_QUEUE_KEY, JSON.stringify(queue)); } catch (e) {}
}

function formatSummaryMessage(summary) {
  return [
    `Modo: ${summary.mode}`,
    `Assunto: ${summary.title}`,
    `Acertos: ${summary.correct} · Erros: ${summary.wrong}`,
    `XP ganho nesta sessão: +${summary.xpGained}`,
    `XP total: ${summary.totalXp} · Nível: ${summary.level}`,
    `Sequência de dias (streak): ${summary.streak} 🔥`,
  ].join("\n");
}

/* envia (ou enfileira, se falhar) o resumo de uma sessão de estudo */
function sendSessionReport(summary) {
  if (!EMAIL_CONFIG.enabled) return; // recurso desligado — não faz nada

  const payload = {
    student_name: summary.studentName,
    date: new Date().toLocaleString("pt-BR"),
    mode: summary.mode,
    title: summary.title,
    correct: summary.correct,
    wrong: summary.wrong,
    xp_gained: summary.xpGained,
    total_xp: summary.totalXp,
    level: summary.level,
    streak: summary.streak,
    message: formatSummaryMessage(summary),
    to_email: EMAIL_CONFIG.toEmail,
  };

  attemptSend(payload);
}

function attemptSend(payload) {
  if (typeof emailjs === "undefined" || !navigator.onLine) {
    queueEmail(payload);
    return;
  }
  emailjs
    .send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, payload)
    .then(() => {
      console.log("Resumo enviado por e-mail com sucesso.");
    })
    .catch((err) => {
      console.warn("Falha ao enviar e-mail, guardando na fila:", err);
      queueEmail(payload);
    });
}

function queueEmail(payload) {
  const queue = loadEmailQueue();
  queue.push(payload);
  saveEmailQueue(queue);
}

function flushEmailQueue() {
  if (!EMAIL_CONFIG.enabled || typeof emailjs === "undefined" || !navigator.onLine) return;
  const queue = loadEmailQueue();
  if (!queue.length) return;
  saveEmailQueue([]); // limpa otimisticamente; qualquer falha reenfileira de novo
  queue.forEach((payload) => attemptSend(payload));
}

window.addEventListener("online", flushEmailQueue);
document.addEventListener("DOMContentLoaded", () => {
  initEmailJS();
  setTimeout(flushEmailQueue, 1500);
});
