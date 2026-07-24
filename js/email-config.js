/* ============================================================
   email-config.js — PREENCHA AQUI (o único arquivo que você
   precisa editar para o resumo automático por e-mail funcionar)
   ============================================================

   Como conseguir esses dados (grátis, ~5 minutos):
   1. Crie uma conta grátis em https://www.emailjs.com/
   2. Em "Email Services", conecte seu Gmail (ou outro) → copie o "Service ID"
   3. Em "Email Templates", crie um template novo usando o texto sugerido
      no README.md → copie o "Template ID"
   4. Em "Account" → "General", copie sua "Public Key"
   5. Cole os três valores abaixo, troque "enabled" para true, e troque
      o "toEmail" pelo seu e-mail de verdade.
   ============================================================ */

const EMAIL_CONFIG = {
  enabled: false, // troque para true depois de preencher tudo abaixo
  publicKey: "SUA_PUBLIC_KEY_AQUI",
  serviceId: "SEU_SERVICE_ID_AQUI",
  templateId: "SEU_TEMPLATE_ID_AQUI",
  toEmail: "seuemail@exemplo.com",
};
