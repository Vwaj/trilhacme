/* ============================================================
   data.js — Banco de conteúdo (Trilha CME)
   Visão geral introdutória de Central de Material e Esterilização,
   baseada em referências públicas e amplamente aceitas na área
   (classificação de Spaulding, RDC nº 15/2012 da ANVISA, fluxo
   padrão de processamento). Conteúdo genérico/educativo — não
   substitui os POPs e protocolos específicos de cada instituição.
   ============================================================ */

const QUEST_DATA = {
  subjects: [
    {
      id: "cme", name: "CME", icon: "🏥", color: "#2E9CCA",
      fases: [
        {
          id: "cme-f1", title: "Fase 1 · Fundamentos da CME",
          missions: [
            {
              id: "cme-1-1", title: "O que é a CME",
              explanation:
                "A <b>CME</b> (Central de Material e Esterilização) é o setor responsável por receber, limpar, preparar, esterilizar e distribuir os artigos usados em procedimentos de saúde — cirúrgicos, ambulatoriais e outros — garantindo que cheguem seguros e livres de microrganismos até o paciente.<br><br>📌 <b>Por que importa:</b> é uma das áreas mais estratégicas na prevenção de <b>IRAS</b> (Infecções Relacionadas à Assistência à Saúde), mesmo trabalhando nos bastidores, longe do paciente.",
              exercises: [
                { id: "cme-1-1-1", type: "mc", q: "CME é a sigla para:", options: ["Central de Material e Esterilização", "Comissão de Meio Ambiente", "Centro Médico Especializado", "Conselho de Medicina e Ética"], answer: 0, hint: "Pense nas três funções principais do setor." },
                { id: "cme-1-1-2", type: "mc", q: "A principal função da CME é:", options: ["administrar recursos financeiros do hospital", "processar artigos com segurança para reduzir o risco de infecção", "atender pacientes diretamente no leito", "treinar médicos"], answer: 1, hint: "É um trabalho de bastidor, mas essencial pra segurança do paciente." },
                { id: "cme-1-1-3", type: "mc", q: "IRAS é a sigla para:", options: ["Infecção Relacionada à Assistência à Saúde", "Instituto de Regulação e Auditoria em Saúde", "Indicador de Risco em Área de Saúde", "Inspeção Regular de Ambientes de Saúde"], answer: 0, hint: "É o principal risco que a CME ajuda a prevenir." },
                { id: "cme-1-1-4", type: "text", q: "Qual é a sigla do setor responsável por limpar, preparar e esterilizar materiais hospitalares?", answer: "CME", hint: "As mesmas três palavras do início desta missão." },
                { id: "cme-1-1-5", type: "mc", q: "Um processamento inadequado dos artigos pode principalmente causar:", options: ["economia de recursos", "infecções nos pacientes", "mais rapidez nas cirurgias", "menos trabalho para a equipe"], answer: 1, hint: "Pense no principal risco de uma falha no processo." },
              ],
            },
            {
              id: "cme-1-2", title: "Classificação de Spaulding",
              explanation:
                "Em 1968, Earle Spaulding propôs classificar os artigos de saúde conforme o <b>risco de infecção</b> que oferecem — e essa lógica orienta a CME até hoje: <b>críticos</b> (entram em tecidos estéreis ou na corrente sanguínea → precisam de esterilização), <b>semicríticos</b> (tocam mucosas ou pele não íntegra → desinfecção de alto nível) e <b>não críticos</b> (tocam só pele íntegra → desinfecção de nível baixo/intermediário já basta).",
              exercises: [
                { id: "cme-1-2-1", type: "mc", q: "Artigos críticos são aqueles que:", options: ["tocam só a pele íntegra", "entram em contato com tecidos estéreis ou corrente sanguínea", "ficam guardados no armário", "nunca tocam o paciente"], answer: 1, hint: "É o nível de risco mais alto da classificação." },
                { id: "cme-1-2-2", type: "mc", q: "Um artigo crítico precisa passar por:", options: ["limpeza apenas", "desinfecção de baixo nível", "esterilização", "nenhum processo especial"], answer: 2, hint: "O risco mais alto exige o processo mais rigoroso." },
                { id: "cme-1-2-3", type: "mc", q: "Artigos semicríticos entram em contato com:", options: ["tecidos estéreis", "mucosas ou pele não íntegra", "apenas o ar do ambiente", "só pele íntegra"], answer: 1, hint: "É o nível de risco intermediário." },
                { id: "cme-1-2-4", type: "mc", q: "Um estetoscópio, que toca só a pele íntegra do paciente, é classificado como:", options: ["crítico", "semicrítico", "não crítico", "não precisa de nenhuma limpeza"], answer: 2, hint: "É o nível de risco mais baixo da classificação." },
                { id: "cme-1-2-5", type: "text", q: "Quem propôs, em 1968, a classificação de artigos em críticos, semicríticos e não críticos?", answer: "Spaulding", hint: "É o sobrenome que dá nome à classificação." },
              ],
            },
          ],
        },
        {
          id: "cme-f2", title: "Fase 2 · O Fluxo de Processamento",
          missions: [
            {
              id: "cme-2-1", title: "Etapas do processamento de artigos",
              explanation:
                "O processamento de artigos segue um fluxo padronizado: <b>recepção</b> (artigos sujos chegam e são conferidos) → <b>limpeza</b> (remoção de sujidade, manual ou automatizada) → <b>preparo e inspeção</b> (secagem, checagem de integridade, montagem de kits) → <b>esterilização/desinfecção</b> → <b>armazenamento</b> → <b>distribuição</b> aos setores que vão usar.",
              exercises: [
                { id: "cme-2-1-1", type: "mc", q: "Qual é a primeira etapa do processamento de um artigo na CME?", options: ["esterilização", "recepção", "distribuição", "armazenamento"], answer: 1, hint: "É onde o artigo sujo chega e é conferido." },
                { id: "cme-2-1-2", type: "mc", q: "A etapa de limpeza tem como objetivo principal:", options: ["embalar o material", "remover sujidade e matéria orgânica", "imprimir etiquetas", "guardar o material"], answer: 1, hint: "Antes de esterilizar, é preciso tirar toda sujidade visível." },
                { id: "cme-2-1-3", type: "mc", q: "Depois de limpo, antes de esterilizar, o artigo passa por:", options: ["distribuição direta", "preparo e inspeção (secagem, checagem, montagem)", "descarte", "nenhuma etapa extra"], answer: 1, hint: "É preciso secar e checar a integridade antes do próximo passo." },
                { id: "cme-2-1-4", type: "mc", q: "A última etapa do fluxo, que leva o material esterilizado até quem vai usá-lo, é:", options: ["recepção", "limpeza", "distribuição", "preparo"], answer: 2, hint: "É o fim da jornada do artigo dentro da CME." },
                { id: "cme-2-1-5", type: "text", q: "Complete a ordem do fluxo: recepção, limpeza, preparo, esterilização, armazenamento e ___.", answer: "distribuição", hint: "É a etapa final, que leva o material pra quem vai usar." },
              ],
            },
            {
              id: "cme-2-2", title: "Métodos de esterilização",
              explanation:
                "Os principais métodos usados na CME são: <b>autoclave a vapor</b> (calor úmido sob pressão — o mais comum e mais barato), <b>óxido de etileno</b> (gás, usado em materiais sensíveis ao calor — processo mais demorado) e <b>plasma de peróxido de hidrogênio</b> (baixa temperatura, mais rápido que o óxido de etileno — também para materiais termossensíveis).",
              exercises: [
                { id: "cme-2-2-1", type: "mc", q: "O método de esterilização mais comum na maioria das CMEs é:", options: ["óxido de etileno", "autoclave a vapor", "plasma de peróxido de hidrogênio", "álcool 70%"], answer: 1, hint: "É o método mais tradicional e mais barato." },
                { id: "cme-2-2-2", type: "mc", q: "Materiais sensíveis ao calor (termossensíveis) geralmente NÃO podem ser esterilizados por:", options: ["óxido de etileno", "plasma de peróxido de hidrogênio", "autoclave a vapor", "métodos de baixa temperatura"], answer: 2, hint: "Esse método usa calor, o que danificaria o material." },
                { id: "cme-2-2-3", type: "mc", q: "A autoclave a vapor esteriliza usando:", options: ["calor seco", "calor úmido sob pressão", "luz ultravioleta", "álcool"], answer: 1, hint: "Pense em 'vapor' — é calor combinado com umidade." },
                { id: "cme-2-2-4", type: "mc", q: "Uma vantagem do plasma de peróxido de hidrogênio é:", options: ["ser o método mais barato", "funcionar em baixa temperatura e ser mais rápido que o óxido de etileno", "não precisar de nenhum controle", "funcionar só com calor seco"], answer: 1, hint: "É indicado justamente para materiais que não podem esquentar." },
                { id: "cme-2-2-5", type: "mc", q: "O óxido de etileno é um método baseado em:", options: ["vapor de água", "um gás químico", "radiação", "luz ultravioleta"], answer: 1, hint: "É um processo químico, não físico." },
              ],
            },
          ],
        },
        {
          id: "cme-f3", title: "Fase 3 · Controle de Qualidade e Segurança",
          missions: [
            {
              id: "cme-3-1", title: "Indicadores de esterilização",
              explanation:
                "Para confirmar que a esterilização funcionou de verdade, usamos três tipos de indicadores: <b>físicos</b> (registros de temperatura, pressão e tempo do próprio equipamento), <b>químicos</b> (fitas ou tiras que mudam de cor quando expostas ao processo) e <b>biológicos</b> (o mais confiável — usa esporos resistentes pra confirmar que até eles foram eliminados).",
              exercises: [
                { id: "cme-3-1-1", type: "mc", q: "O indicador considerado mais confiável para confirmar a esterilização é o:", options: ["físico", "químico", "biológico", "visual"], answer: 2, hint: "Usa esporos resistentes como teste definitivo." },
                { id: "cme-3-1-2", type: "mc", q: "Indicadores químicos geralmente funcionam:", options: ["medindo a temperatura do equipamento", "mudando de cor quando expostos ao processo", "contando esporos vivos", "pesando o material"], answer: 1, hint: "São as famosas fitas/tiras que mudam de cor." },
                { id: "cme-3-1-3", type: "mc", q: "Indicadores físicos são, por exemplo:", options: ["fitas coloridas", "esporos bacterianos", "registros de temperatura/pressão/tempo do equipamento", "etiquetas de papel"], answer: 2, hint: "Vêm direto dos parâmetros registrados pelo equipamento." },
                { id: "cme-3-1-4", type: "mc", q: "Indicadores biológicos usam:", options: ["esporos resistentes ao processo", "apenas mudança de cor", "apenas temperatura", "nenhum material especial"], answer: 0, hint: "São microrganismos resistentes usados como teste." },
                { id: "cme-3-1-5", type: "text", q: "Qual tipo de indicador é considerado o mais confiável (usa esporos)?", answer: "biológico", hint: "É o terceiro tipo mencionado na explicação." },
              ],
            },
            {
              id: "cme-3-2", title: "Normas, biossegurança e rastreabilidade",
              explanation:
                "No Brasil, o funcionamento da CME é regulado principalmente pela <b>RDC nº 15/2012 da ANVISA</b>, que define boas práticas para o processamento de produtos de saúde. Além disso, os profissionais usam <b>EPIs</b> (Equipamentos de Proteção Individual), e cada lote processado é registrado — a <b>rastreabilidade</b> — para saber exatamente quando, como e por quem cada material foi processado, caso algo precise ser investigado depois.",
              exercises: [
                { id: "cme-3-2-1", type: "mc", q: "No Brasil, a principal norma que regula a CME é a:", options: ["RDC nº 15/2012 da ANVISA", "Lei Áurea", "Constituição Federal", "RDC nº 1/1988"], answer: 0, hint: "É uma resolução específica da ANVISA para produtos de saúde." },
                { id: "cme-3-2-2", type: "mc", q: "EPI é a sigla para:", options: ["Equipamento de Proteção Individual", "Exame Padrão de Infecção", "Estudo de Prevenção Interna", "Equipe de Procedimentos Invasivos"], answer: 0, hint: "Pense em luvas, óculos, máscara..." },
                { id: "cme-3-2-3", type: "mc", q: "Registrar quando, como e por quem cada lote de material foi processado é chamado de:", options: ["reciclagem", "rastreabilidade", "esterilização", "triagem"], answer: 1, hint: "Permite 'rastrear' o histórico de cada lote." },
                { id: "cme-3-2-4", type: "mc", q: "A rastreabilidade é importante principalmente para:", options: ["economizar tempo", "permitir investigar problemas se algo der errado", "decorar o setor", "vender o material"], answer: 1, hint: "Pense em auditoria e segurança do paciente." },
                { id: "cme-3-2-5", type: "mc", q: "Qual órgão brasileiro publica a norma RDC nº 15/2012 sobre CME?", options: ["ANVISA", "Ministério da Educação", "INSS", "Receita Federal"], answer: 0, hint: "É a agência reguladora de vigilância sanitária." },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/* ============================================================
   DAILY_TRIVIA — pool de curiosidades (história do Brasil,
   curiosidades gerais e algumas de CME). 5 são sorteadas por dia.
   ============================================================ */
const DAILY_TRIVIA = [
  { id: "tv-1", category: "CME", text: "A esterilização elimina todos os microrganismos, inclusive esporos.", isTrue: true, explain: "Essa é justamente a diferença entre esterilização e desinfecção: esterilização é o nível máximo, sem exceções." },
  { id: "tv-2", category: "CME", text: "Álcool 70% é considerado um método de esterilização.", isTrue: false, explain: "O álcool 70% é um desinfetante, não um esterilizante — ele não elimina esporos bacterianos resistentes." },
  { id: "tv-3", category: "CME", text: "A autoclave a vapor costuma ser mais barata de operar que o óxido de etileno.", isTrue: true, explain: "Por isso a autoclave é o método mais usado sempre que o material aguenta calor e umidade." },
  { id: "tv-4", category: "CME", text: "Todo material usado em cirurgia pode ser processado apenas com álcool 70%.", isTrue: false, explain: "Artigos críticos (que entram em tecidos estéreis) exigem esterilização completa, não apenas desinfecção." },
  { id: "tv-5", category: "História do Brasil", text: "O Brasil foi 'descoberto' pelos portugueses em 1500, liderados por Pedro Álvares Cabral.", isTrue: true, explain: "A esquadra portuguesa chegou à costa da Bahia em abril de 1500." },
  { id: "tv-6", category: "História do Brasil", text: "A capital do Brasil sempre foi Brasília, desde o início da colonização.", isTrue: false, explain: "Antes de Brasília (1960), a capital já foi Salvador e depois o Rio de Janeiro." },
  { id: "tv-7", category: "História do Brasil", text: "A Proclamação da Independência do Brasil aconteceu em 1822.", isTrue: true, explain: "Foi Dom Pedro I quem proclamou, às margens do rio Ipiranga." },
  { id: "tv-8", category: "História do Brasil", text: "Dom Pedro II foi o primeiro imperador do Brasil.", isTrue: false, explain: "O primeiro foi Dom Pedro I — Dom Pedro II foi seu filho, o segundo imperador." },
  { id: "tv-9", category: "História do Brasil", text: "A escravidão foi abolida no Brasil em 1888, pela Lei Áurea.", isTrue: true, explain: "Foi assinada pela Princesa Isabel, encerrando oficialmente a escravidão no país." },
  { id: "tv-10", category: "História do Brasil", text: "O Brasil já teve mais de uma bandeira oficial ao longo da história.", isTrue: true, explain: "A bandeira mudou algumas vezes desde a época do Império até a República." },
  { id: "tv-11", category: "História do Brasil", text: "A capital do Brasil foi transferida para Brasília em 1960.", isTrue: true, explain: "A mudança foi um projeto do presidente Juscelino Kubitschek." },
  { id: "tv-12", category: "História do Brasil", text: "O carnaval é uma festa que só existe no Brasil.", isTrue: false, explain: "O carnaval é celebrado em vários países, como Portugal, Itália e países do Caribe." },
  { id: "tv-13", category: "Curiosidades", text: "O coração humano bate, em média, mais de 100 mil vezes por dia.", isTrue: true, explain: "Em repouso, o coração bate cerca de 60 a 100 vezes por minuto — somando o dia todo, passa de 100 mil batidas!" },
  { id: "tv-14", category: "Curiosidades", text: "Os polvos têm três corações.", isTrue: true, explain: "Dois corações bombeiam sangue para as brânquias, e um terceiro para o resto do corpo." },
  { id: "tv-15", category: "Curiosidades", text: "A luz do Sol demora cerca de 8 minutos para chegar à Terra.", isTrue: true, explain: "Mesmo viajando na velocidade da luz, a distância até o Sol é enorme." },
  { id: "tv-16", category: "Curiosidades", text: "Todos os planetas do Sistema Solar têm anéis, como Saturno.", isTrue: false, explain: "Só alguns planetas gasosos (Saturno, Júpiter, Urano e Netuno) têm anéis — a Terra e Marte não têm." },
  { id: "tv-17", category: "Curiosidades", text: "O corpo humano adulto tem 206 ossos.", isTrue: true, explain: "Bebês nascem com mais ossos, que vão se fundindo ao longo do crescimento." },
  { id: "tv-18", category: "Curiosidades", text: "As formigas conseguem carregar objetos muito mais pesados que o próprio corpo.", isTrue: true, explain: "Algumas espécies carregam até 50 vezes o próprio peso!" },
  { id: "tv-19", category: "Curiosidades", text: "A Grande Muralha da China pode ser vista a olho nu do espaço.", isTrue: false, explain: "Isso é um mito popular — astronautas confirmam que ela não é visível a olho nu do espaço." },
  { id: "tv-20", category: "Curiosidades", text: "O corpo humano é composto principalmente por água.", isTrue: true, explain: "Cerca de 60% do corpo de um adulto é água." },
];

/* ============================================================
   FEYNMAN_TOPICS — temas do Modo "Ensine o Sistema"
   ============================================================ */
const FEYNMAN_TOPICS = [
  {
    id: "fey-fluxo-cme", subjectId: "cme", title: "Fluxo da CME",
    prompt: "Explique com suas próprias palavras as etapas do processamento de um artigo na CME, do início ao fim.",
    keywords: ["recepção", "limpeza", "preparo", "esterilização", "armazenamento", "distribuição"],
  },
  {
    id: "fey-spaulding", subjectId: "cme", title: "Classificação de Spaulding",
    prompt: "Explique com suas próprias palavras a diferença entre artigos críticos, semicríticos e não críticos.",
    keywords: ["crítico", "semicrítico", "não crítico", "tecido", "mucosa", "pele", "esterilização", "desinfecção"],
  },
];
