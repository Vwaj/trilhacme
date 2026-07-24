# 🧭 Trilha CME

Versão do app "Trilha" com conteúdo introdutório de **Central de Material e Esterilização (CME)** — mesma engine gamificada (missões, fases, XP, som, revisão inteligente, resumo por e-mail), conteúdo diferente. Feito para apresentar a proposta à Cami e servir de base pra expandir depois.

⚠️ **Este é um app separado e independente do "Trilha" do Lucas.** Mesmo código-base, mas cada um deve rodar no seu próprio link/repositório/APK — não há nenhuma ligação entre os dois (progresso, e-mail, dados — tudo isolado).

O conteúdo de CME aqui é uma **visão geral introdutória**, baseada em referências públicas amplamente aceitas na área (classificação de Spaulding, RDC nº 15/2012 da ANVISA, fluxo padrão de processamento). Não substitui os POPs e protocolos específicos da sua instituição — é uma base pra fixar conceitos gerais, e pode ser expandida com conteúdo mais específico depois.

---

## 🎮 O que tem dentro

- **Trilha de missões** de CME (3 fases: Fundamentos, Fluxo de Processamento, Controle de Qualidade) — cada missão tem uma explicação curtinha + 5 exercícios.
- **Sistema de XP e níveis**, com barra de progresso, contador de XP **ao vivo** durante a missão e efeito visual de "+XP" a cada acerto.
- **Streak (sequência de dias)** — estudar todo dia mantém a "chama" acesa 🔥.
- **Revisão inteligente (repetição espaçada)** — perguntas erradas voltam com mais frequência; as dominadas quase não aparecem mais.
- **Modo Prova** — 10 questões, tempo limitado (5 min), sem dicas, resultado e correção no final.
- **Modo "Ensine o Sistema"** (técnica Feynman) — o usuário escreve, com as próprias palavras, o que entendeu de um assunto, e recebe um feedback simples sobre o que já domina e o que falta.
- **Conquistas (badges)** — primeira missão, 3 e 7 dias de streak, nível 5, 100% numa prova, 5 explicações no modo Ensine.
- **Música e efeitos sonoros** — trilha de fundo e sons de acerto/erro/level-up, gerados por código (sem arquivos de áudio, sem internet, sem direitos autorais). Botão 🔊/🔇 pra ligar/desligar.
- **Vibração tátil** e **tela não apaga durante o estudo** (Wake Lock).
- **Resumo automático por e-mail** — a cada missão, revisão, prova ou explicação concluída, um resumo (acertos, erros, XP, streak) pode ser enviado automaticamente pro seu e-mail (veja como configurar abaixo).
- **100% offline depois de instalado** — tudo roda no próprio celular. Os dados de progresso ficam salvos só no navegador/app do aparelho (localStorage); só o envio de e-mail precisa de internet no momento do envio (e fica numa fila local se não tiver conexão).

---

## 📁 Estrutura de arquivos

```
estudapp/
├── index.html          → tela única do app (todas as "telas" internas)
├── manifest.json        → configuração do PWA (nome, ícone, cores)
├── service-worker.js    → cache offline
├── css/
│   └── style.css        → todo o visual do app
├── js/
│   ├── data.js           → banco de missões e perguntas (fácil de editar!)
│   ├── storage.js        → salvar/carregar progresso (localStorage)
│   ├── srs.js             → lógica da repetição espaçada
│   ├── sounds.js          → música e efeitos sonoros (sintetizados, sem arquivos externos)
│   ├── email-config.js    → ⚠️ EDITE AQUI suas chaves do EmailJS (resumo automático)
│   ├── email.js           → lógica de envio de e-mail + fila offline
│   └── app.js             → lógica principal (telas, XP, prova, etc.)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## 📧 Configurar o resumo automático por e-mail (EmailJS)

Isso faz o app te mandar um e-mail sozinho, sem ninguém precisar tocar em nada, toda vez que a Cami terminar uma missão, revisão, prova ou explicação. Leva uns 5 minutos, uma vez só, e é grátis (até 200 e-mails/mês no plano free — mais que suficiente).

1. Crie uma conta grátis em **[emailjs.com](https://www.emailjs.com/)**.
2. No painel, vá em **Email Services** → **Add New Service** → escolha **Gmail** (ou o e-mail que preferir) → conecte sua conta → copie o **Service ID** gerado (algo como `service_abc1234`).
3. Vá em **Email Templates** → **Create New Template**. Cole isto no corpo do template:

   ```
   Assunto: 📚 Resumo de estudo — {{student_name}}

   Olá!

   {{student_name}} acabou de estudar no app Trilha.

   Data: {{date}}
   Modo: {{mode}}
   Assunto: {{title}}
   Acertos: {{correct}}  |  Erros: {{wrong}}
   XP ganho nesta sessão: +{{xp_gained}}
   XP total: {{total_xp}}  |  Nível: {{level}}
   Sequência de dias seguidos: {{streak}} 🔥

   {{message}}
   ```

   Em **"To Email"** (configuração do template, não do corpo), coloque `{{to_email}}`. Salve e copie o **Template ID** (algo como `template_xyz789`).
4. Vá em **Account** → **General** → copie sua **Public Key**.
5. Abra o arquivo `js/email-config.js` (dentro da pasta `estudapp`) num editor de texto simples (Bloco de Notas serve) e preencha:
   ```js
   const EMAIL_CONFIG = {
     enabled: true,                    // troque de false para true
     publicKey: "cole_aqui",
     serviceId: "cole_aqui",
     templateId: "cole_aqui",
     toEmail: "seuemail@exemplo.com",  // pra onde os resumos vão chegar
   };
   ```
6. Salve o arquivo. Se ainda não gerou o APK, é só seguir os passos abaixo normalmente. Se já tinha gerado antes, precisa subir os arquivos atualizados no GitHub e gerar o APK de novo no PWABuilder (veja os passos a seguir).

**Importante:** se o celular estiver sem internet no momento em que a Cami terminar de estudar, o resumo fica guardado esperando e é enviado sozinho assim que a conexão voltar — nada se perde.

---

## 🚀 Como rodar no celular Android — gerando um APK de verdade

### 📦 Passo 1 — Colocar o app num link público (necessário pra gerar o APK)

O PWABuilder (ferramenta que gera o APK) precisa acessar seu app por um link de internet de verdade — não funciona com `localhost`. A forma mais simples e gratuita é o **GitHub Pages**:

1. Crie uma conta grátis em **[github.com](https://github.com/)** (se ainda não tiver).
2. Clique em **"New repository"** → dê um nome (ex: `trilha-cme`) → marque como **Public** → **Create repository**.
3. Dentro do repositório vazio, clique em **"uploading an existing file"** (ou o botão de upload) e arraste **todo o conteúdo** da pasta `estudapp` (os arquivos e subpastas `css/`, `js/`, `icons/`, mais o `index.html`, `manifest.json` e `service-worker.js`) → **Commit changes**.
4. **Importante:** crie também um arquivo vazio chamado `.nojekyll` na raiz do repositório (Add file → Create new file → nome `.nojekyll` → pode deixar vazio → Commit). Sem isso, o GitHub Pages ignora certas pastas ocultas que o app pode precisar mais pra frente.
5. Vá em **Settings** → **Pages** (menu lateral) → em "Source", escolha a branch `main` e a pasta `/root` → **Save**.
6. Espere ~1 minuto. Vai aparecer um link tipo `https://seu-usuario.github.io/trilha-cme/`. Abra esse link no navegador e confirme que o app carrega normalmente.

### 📱 Passo 2 — Gerar o APK com o PWABuilder

1. Acesse **[pwabuilder.com](https://www.pwabuilder.com/)**.
2. Cole o link do GitHub Pages (do passo anterior) na caixa de busca → **Start**.
3. O PWABuilder vai analisar o app (manifest, ícones, service worker) e mostrar notas verdes ✅ pra cada item — o app já foi construído pra passar nessa checagem.
4. Clique em **"Package for stores"** → escolha **Android**.
5. Nas opções, procure a alternativa de gerar um **pacote assinado (Signed)** — é a mais simples pra instalar direto no celular sem passos extras de assinatura manual.
6. Clique em **Generate** / **Download** — vai baixar um arquivo `.zip` contendo o `.apk`.

💡 **Nível avançado (opcional, deixa sem nenhuma barra de endereço):** o PWABuilder também gera um arquivo `assetlinks.json`. Se quiser colocá-lo em `https://seu-usuario.github.io/trilha-cme/.well-known/assetlinks.json` (criando essa pasta/arquivo no mesmo repositório do GitHub, lembrando do `.nojekyll` do passo anterior), o app fica 100% indistinguível de um app nativo, sem nenhum resquício de navegador. Sem esse passo, o app já funciona perfeitamente — só pode aparecer uma fina barra de endereço no topo.

### 📲 Passo 3 — Instalar no celular da Cami

1. Envie o arquivo `.apk` (de dentro do zip baixado) pro celular dele — por e-mail, WhatsApp (como "documento", não como imagem) ou Google Drive.
2. Toque no arquivo `.apk` no celular. O Android vai avisar algo como "instalar apps de fontes desconhecidas" — toque em **Permitir** (é uma configuração única, específica pra esse arquivo).
3. Toque em **Instalar**. Pronto — surge um ícone "Trilha" na gaveta de apps do celular, como qualquer outro app.
4. A partir daí, é só tocar no ícone. Sem navegador, sem comandos, sem loja — exatamente como você pediu.

**Atualizações futuras:** se você editar `data.js` (novas perguntas) ou qualquer outro arquivo, precisa: subir os arquivos atualizados de novo no GitHub → gerar um novo APK no PWABuilder → reenviar e reinstalar no celular (o Android deixa instalar por cima, sem perder o progresso salvo).

### 🅱️ Alternativa mais simples (sem gerar APK) — se quiser testar rápido antes

Se quiser ver o app funcionando no celular *hoje*, antes de mexer com GitHub/PWABuilder, dá pra abrir o link do GitHub Pages direto no Chrome do celular e tocar em **"Adicionar à tela inicial"** no menu (⋮) — ele já abre em tela cheia, funciona offline, só não vira um arquivo `.apk` de verdade. Bom passo intermediário pra validar tudo antes de gerar o pacote final.

---

## ✏️ Como adicionar mais perguntas e matérias

Tudo fica em `js/data.js`. Cada matéria é um objeto dentro de `QUEST_DATA.subjects`, e cada missão tem uma `explanation` (texto curto) e uma lista de `exercises`. Basta copiar o formato de uma missão existente e trocar o conteúdo — o app se organiza sozinho (trilha, XP, revisão) automaticamente para qualquer pergunta nova.

Tipos de exercício suportados:
- `type: "mc"` → múltipla escolha (`options` + índice da `answer`)
- `type: "text"` → resposta digitada (`answer` + `altAnswers` opcionais para variações aceitas)

---

## 🆕 Melhorias já aplicadas nesta versão

- ✅ **Marcador visual de seleção** — ao tocar numa alternativa, ela agora fica destacada em roxo com um ✓, antes mesmo de confirmar.
- ✅ **Botão de tela cheia (⛶)** — funciona direto no navegador, sem precisar instalar nada.
- ✅ **Modo imersivo automático quando instalado** — o app já pede pra abrir em tela cheia quando instalado.
- ✅ **Vibração leve (tátil)** e **tela não apaga durante o estudo** (Wake Lock).
- ✅ **Música de fundo + efeitos sonoros**, sintetizados por código (sem arquivos externos) — botão 🔊/🔇 pra controlar.
- ✅ **Contador de XP ao vivo** durante a missão/revisão, mostrando o quanto já ganhou na sessão a cada acerto e erro.
- ✅ **Resumo automático por e-mail** ao final de cada sessão (via EmailJS), com fila de reenvio se estiver offline.
- ✅ **Passo a passo para gerar um APK de verdade** (GitHub Pages + PWABuilder), instalável sem loja e sem comandos no celular da Cami.

## 🗺️ Ideias para os próximos upgrades (ainda não implementadas)

Em ordem de impacto x esforço, do mais simples ao mais trabalhoso:

1. **Confete/animação de comemoração** ao subir de nível ou terminar uma missão.
2. **Mais matérias e missões** — Inglês, Ciências, História, seguindo o padrão já pronto em `data.js`.
3. **Loja de avatares** — desbloquear novos avatares/skins gastando XP.
4. **Lembrete diário** (notificação push) — pedir permissão de notificação e lembrar "hora de manter o streak!".
5. **Modo pai/professor** — uma tela extra (protegida por PIN simples) com estatísticas mais detalhadas.
6. **Sincronizar entre aparelhos** — hoje o progresso é 100% local; exigiria um servidor.

Se quiser, posso implementar qualquer um desses agora — é só escolher por onde seguir.

---

Feito com carinho para ajudar quem está aprendendo a aprender. 🚀
