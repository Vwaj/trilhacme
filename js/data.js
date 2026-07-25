/* ============================================================
   data.js — Trilha CME · Modo Especialista
   Game de perguntas técnicas sobre Central de Material e
   Esterilização, calibrado como uma escadinha de dificuldade:
   Fase 1 (técnico-básico) → Fase 4 (cabulosas/pegadinhas).
   Baseado em AAMI ST79/ST77, ANVISA RDC nº 15/2012, ISO 11140
   e literatura consolidada de processamento de produtos de saúde.
   ============================================================ */

const QUEST_DATA = {
  subjects: [
    {
      id: "cme", name: "CME", icon: "🏥", color: "#2E9CCA",
      fases: [
        {
          id: "cme-f1", title: "Fase 1 · Aquecimento Técnico",
          missions: [
            {
              id: "cme-1-1", title: "Classificação e Terminologia",
              explanation: "Ronda 1. Nada de mole — mas ainda é chão de fábrica.",
              exercises: [
                { id: "cme-1-1-1", type: "mc", q: "Segundo Spaulding, um artigo que penetra tecidos estéreis ou o sistema vascular deve ser submetido a:", options: ["desinfecção de alto nível", "desinfecção de nível intermediário", "esterilização", "apenas limpeza"], answer: 2, hint: "É a categoria de maior risco da classificação." },
                { id: "cme-1-1-2", type: "mc", q: "Um SAL (Sterility Assurance Level) de 10⁻⁶ significa:", options: ["1 em 1.000 chance de sobrevivência de um microrganismo", "1 em 1.000.000 chance de sobrevivência de um microrganismo", "100% de garantia de esterilidade absoluta", "6 minutos de exposição ao agente esterilizante"], answer: 1, hint: "Leia o expoente como uma probabilidade." },
                { id: "cme-1-1-3", type: "mc", q: "O 'D-value' de um microrganismo representa:", options: ["o tempo para reduzir a população em 90% (1 log) numa dada temperatura", "a dose total de radiação necessária", "o diâmetro do esporo em micrômetros", "a temperatura mínima de esterilização"], answer: 0, hint: "É um conceito de cinética de morte microbiana." },
                { id: "cme-1-1-4", type: "text", q: "Por convenção (método overkill), quantos 'logs' de redução microbiana são exigidos para validar um ciclo de esterilização?", answer: "12", hint: "É o dobro do SAL padrão de 10⁻⁶ somado à carga inicial de referência." },
                { id: "cme-1-1-5", type: "mc", q: "Um endoscópio flexível que toca mucosa, mas não penetra tecido estéril, é classificado, segundo Spaulding, como:", options: ["crítico", "semicrítico", "não crítico", "artigo especial"], answer: 1, hint: "Mucosa íntegra é a categoria intermediária." }
              ]
            },
            {
              id: "cme-1-2", title: "Parâmetros de Ciclo a Vapor",
              explanation: "Ronda 2. Números de verdade agora.",
              exercises: [
                { id: "cme-1-2-1", type: "mc", q: "No ciclo de pré-vácuo, qual combinação tempo/temperatura é a mais citada pela AAMI ST79?", options: ["134°C por 3 minutos", "100°C por 30 minutos", "160°C por 2 horas (calor seco)", "121°C por 3 minutos"], answer: 0, hint: "É a combinação usada em ciclos rápidos de pré-vácuo (IUSS)." },
                { id: "cme-1-2-2", type: "mc", q: "No ciclo por gravidade a 121°C, o tempo de exposição para pacotes de instrumentos envelopados costuma ser de:", options: ["3 minutos", "15 minutos", "30 minutos", "60 minutos"], answer: 2, hint: "Gravidade a 121°C exige bem mais tempo que pré-vácuo a 132-134°C." },
                { id: "cme-1-2-3", type: "mc", q: "A principal diferença entre um ciclo de gravidade e um de pré-vácuo é:", options: ["a temperatura máxima atingida", "o método de remoção do ar da câmara antes da esterilização", "o tipo de embalagem permitida", "o fabricante do equipamento"], answer: 1, hint: "Pense em como o ar sai de dentro da câmara." },
                { id: "cme-1-2-4", type: "mc", q: "O ciclo SFPP (Steam-Flush Pressure-Pulse) remove o ar da câmara por meio de:", options: ["gravidade simples", "uma série de fluxos de vapor e pulsos de pressão acima da atmosférica", "vácuo mecânico profundo único", "filtros HEPA"], answer: 1, hint: "É classificado pela AAMI como um tipo de remoção dinâmica de ar, mas sem vácuo." },
                { id: "cme-1-2-5", type: "mc", q: "Comparado ao ciclo por gravidade, o ciclo de pré-vácuo é geralmente:", options: ["mais lento, pois remove o ar passivamente", "mais rápido, pois remove o ar ativamente por vácuo", "idêntico em tempo de exposição", "usado apenas para líquidos"], answer: 1, hint: "Remoção ativa de ar permite ciclos mais curtos." }
              ]
            }
          ]
        },
        {
          id: "cme-f2", title: "Fase 2 · Terreno Difícil",
          missions: [
            {
              id: "cme-2-1", title: "Indicadores e Testes de Rotina",
              explanation: "Ronda 3. Aqui já separa quem estudou de quem só trabalha no automático.",
              exercises: [
                { id: "cme-2-1-1", type: "mc", q: "O microrganismo utilizado em indicadores biológicos para esterilização a vapor é:", options: ["Bacillus atrophaeus", "Geobacillus stearothermophilus", "Clostridium sporogenes", "Bacillus cereus"], answer: 1, hint: "É o esporo termorresistente clássico do teste de vapor." },
                { id: "cme-2-1-2", type: "mc", q: "O microrganismo utilizado em indicadores biológicos para óxido de etileno é:", options: ["Geobacillus stearothermophilus", "Bacillus atrophaeus", "Staphylococcus aureus", "Escherichia coli"], answer: 1, hint: "É um organismo diferente do usado para vapor." },
                { id: "cme-2-1-3", type: "mc", q: "O teste de Bowie-Dick avalia principalmente:", options: ["a esterilidade final da carga", "a penetração de vapor e remoção de ar em ciclos de pré-vácuo", "a validade do indicador biológico", "a temperatura da autoclave"], answer: 1, hint: "Detecta bolsas de ar residual, não mata microrganismos." },
                { id: "cme-2-1-4", type: "mc", q: "O teste de Bowie-Dick deve ser realizado:", options: ["uma vez por mês", "a cada carga processada", "diariamente, antes da primeira carga, em câmara vazia", "apenas quando há suspeita de falha"], answer: 2, hint: "É um teste de rotina diário, não por carga." },
                { id: "cme-2-1-5", type: "text", q: "Qual é o tempo padrão de incubação, em horas, de um indicador biológico convencional (não-rápido) para vapor?", answer: "48", hint: "É o dobro de um dia inteiro." }
              ]
            },
            {
              id: "cme-2-2", title: "Métodos Alternativos de Esterilização",
              explanation: "Ronda 4. Vapor não é o único jogo na cidade.",
              exercises: [
                { id: "cme-2-2-1", type: "mc", q: "A principal função do tempo de aeração após esterilização por óxido de etileno é:", options: ["resfriar o material", "remover resíduos tóxicos do gás residual", "completar a esterilização", "preservar a embalagem"], answer: 1, hint: "O óxido de etileno é tóxico e precisa 'sair' do material." },
                { id: "cme-2-2-2", type: "mc", q: "O plasma de peróxido de hidrogênio é contraindicado para materiais:", options: ["metálicos", "celulósicos (papel, linho) ou com lúmens muito longos e estreitos", "plásticos termossensíveis em geral", "de borracha"], answer: 1, hint: "Celulose absorve o peróxido, e o sistema tem limites de lúmen." },
                { id: "cme-2-2-3", type: "mc", q: "Óxido de etileno é classificado, quanto ao risco à saúde, como:", options: ["inofensivo em qualquer concentração", "carcinogênico e irritante, exigindo controle rigoroso de exposição", "apenas um risco de incêndio", "seguro para inalação direta"], answer: 1, hint: "É por isso que a aeração pós-ciclo é obrigatória." },
                { id: "cme-2-2-4", type: "mc", q: "Materiais processados por plasma de peróxido de hidrogênio NÃO podem ser embalados em:", options: ["papel grau cirúrgico (celulose)", "embalagens sintéticas não-tecidas (ex: Tyvek)", "recipientes rígidos compatíveis", "nenhuma — qualquer embalagem serve"], answer: 0, hint: "Papel absorve o agente esterilizante, inutilizando o ciclo." },
                { id: "cme-2-2-5", type: "mc", q: "Comparado ao óxido de etileno, a principal vantagem do plasma de peróxido de hidrogênio é:", options: ["ser mais barato por ciclo", "não deixar resíduos tóxicos e ter ciclo muito mais curto", "penetrar lumens mais longos", "funcionar sem nenhum tipo de vácuo"], answer: 1, hint: "Pense em tempo de ciclo (minutos vs horas) e toxicidade residual." }
              ]
            }
          ]
        },
        {
          id: "cme-f3", title: "Fase 3 · Modo Avançado",
          missions: [
            {
              id: "cme-3-1", title: "Normas e Limites Técnicos",
              explanation: "Ronda 5. Números que muita gente esquece no dia a dia.",
              exercises: [
                { id: "cme-3-1-1", type: "mc", q: "Segundo a norma AAMI (ST77/ST79), o peso máximo recomendado para um conjunto de instrumentos embalado é de aproximadamente:", options: ["15 libras (~6,8 kg)", "25 libras (~11,3 kg)", "35 libras (~15,9 kg)", "50 libras (~22,7 kg)"], answer: 1, hint: "É o limite mais citado desde a atualização que unificou containers e pacotes." },
                { id: "cme-3-1-2", type: "mc", q: "'Esterilidade relacionada a evento' significa que a validade de um pacote estéril depende:", options: ["exclusivamente da data de esterilização", "de eventos que comprometem a barreira estéril, não apenas do tempo decorrido", "do número de vezes manuseado, com limite fixo de 10 toques", "da cor do indicador químico"], answer: 1, hint: "O conceito substitui a ideia de 'prazo de validade' fixo." },
                { id: "cme-3-1-3", type: "mc", q: "No Brasil, a RDC nº 15/2012 da ANVISA regula:", options: ["apenas hospitais privados", "o processamento de produtos para saúde, públicos ou privados", "somente centros cirúrgicos ambulatoriais", "apenas materiais importados"], answer: 1, hint: "É uma norma de vigilância sanitária abrangente." },
                { id: "cme-3-1-4", type: "mc", q: "Um indicador biológico de leitura rápida (1-3h) detecta esterilização por meio de:", options: ["mudança de cor por pH", "detecção fluorescente de uma enzima associada aos esporos", "contagem manual de colônias", "peso do indicador"], answer: 1, hint: "É uma leitura indireta, não um cultivo tradicional completo." },
                { id: "cme-3-1-5", type: "text", q: "Qual é a sigla do dispositivo usado para desafiar/testar a eficácia de um processo de esterilização, tipicamente contendo um indicador biológico?", answer: "PCD", hint: "Em inglês: Process Challenge Device." }
              ]
            },
            {
              id: "cme-3-2", title: "Cálculos e Conceitos Avançados",
              explanation: "Ronda 6. Hora de fazer conta.",
              exercises: [
                { id: "cme-3-2-1", type: "mc", q: "Se um microrganismo tem D-value de 1 minuto a 121°C, quantos minutos são necessários, pelo método overkill (12 logs), para reduzir teoricamente sua população em 12 logs?", options: ["1 minuto", "6 minutos", "12 minutos", "24 minutos"], answer: 2, hint: "Multiplique o D-value pelo número de logs exigidos." },
                { id: "cme-3-2-2", type: "mc", q: "O parâmetro 'F0' em esterilização térmica representa:", options: ["a temperatura final do ciclo", "a letalidade acumulada equivalente, em minutos, a 121°C", "o fluxo de vapor em litros/minuto", "a pressão final da câmara"], answer: 1, hint: "É uma forma de somar a letalidade do ciclo inteiro numa única unidade." },
                { id: "cme-3-2-3", type: "mc", q: "Um 'log reduction' de 3 (10⁻³) representa uma redução populacional de:", options: ["30%", "90%", "99,9%", "99,99%"], answer: 2, hint: "Cada log é uma casa decimal: 10⁻¹=90%, 10⁻²=99%, 10⁻³=?" },
                { id: "cme-3-2-4", type: "mc", q: "A validação de um ciclo pelo 'método overkill' assume, propositalmente, uma carga microbiana:", options: ["realista e baixa", "artificialmente alta e mais resistente do que se encontraria na prática", "zero, pois o material já chega estéril", "desconhecida e irrelevante"], answer: 1, hint: "É uma margem de segurança deliberadamente exagerada." },
                { id: "cme-3-2-5", type: "text", q: "Partindo de uma carga inicial de referência de 10⁶ esporos, quantos logs totais de redução uma SAL de 10⁻⁶ exige?", answer: "12", hint: "Some os expoentes de 10⁶ até 10⁻⁶." }
              ]
            }
          ]
        },
        {
          id: "cme-f4", title: "Fase 4 · Modo Especialista",
          missions: [
            {
              id: "cme-4-1", title: "Pegadinhas Clássicas",
              explanation: "Ronda 7. Aqui é pegadinha de verdade — leia com atenção antes de responder.",
              exercises: [
                { id: "cme-4-1-1", type: "mc", q: "O organismo dos indicadores biológicos de vapor já foi chamado de 'Bacillus stearothermophilus'. Taxonomicamente, hoje o gênero correto é:", options: ["Clostridium", "Geobacillus", "Staphylococcus", "Enterococcus"], answer: 1, hint: "Houve uma reclassificação taxonômica do gênero." },
                { id: "cme-4-1-2", type: "mc", q: "\"Álcool a 70% é eficaz para ESTERILIZAR instrumentos cirúrgicos críticos.\" Essa afirmação é:", options: ["Verdadeira — álcool esteriliza qualquer material", "Falsa — álcool é desinfetante, não elimina esporos bacterianos resistentes", "Verdadeira, mas só acima de 90%", "Falsa, porque álcool nunca desinfeta nada"], answer: 1, hint: "Esterilização e desinfecção são níveis diferentes de processo." },
                { id: "cme-4-1-3", type: "mc", q: "\"Um indicador químico classe 5 com cor correta já é suficiente, sozinho, para liberar um implante para uso imediato.\" Essa afirmação é:", options: ["Verdadeira", "Falsa — implantes exigem indicador biológico negativo antes da liberação, salvo emergência documentada", "Verdadeira apenas para cargas pequenas", "Falsa, porque indicador químico nunca é usado em implantes"], answer: 1, hint: "Implantes têm exigência extra além do indicador químico." },
                { id: "cme-4-1-4", type: "mc", q: "\"Esterilização elimina 100% de todas as formas de vida microbiana, sem nenhuma probabilidade estatística envolvida.\" Essa afirmação é:", options: ["Verdadeira, por definição", "Falsa — na prática, é expressa como uma probabilidade estatística (SAL), não garantia absoluta", "Verdadeira, mas só para vírus", "Falsa, porque nada elimina esporos"], answer: 1, hint: "Volte ao conceito de SAL 10⁻⁶ visto antes." },
                { id: "cme-4-1-5", type: "mc", q: "\"A lavagem simples das mãos com água e sabão comum remove completamente a flora residente da pele.\" Essa afirmação é:", options: ["Verdadeira", "Falsa — a lavagem comum reduz a flora residente, mas remove sobretudo a flora transitória", "Verdadeira, se lavado por 20 segundos", "Falsa, porque sabão comum não remove nenhuma flora"], answer: 1, hint: "Flora residente e transitória respondem de forma diferente à lavagem simples." }
              ]
            },
            {
              id: "cme-4-2", title: "Casos Extremos e Detalhes Obscuros",
              explanation: "Ronda final. Se você chegou até aqui, já é nível difícil de verdade.",
              exercises: [
                { id: "cme-4-2-1", type: "mc", q: "Em indicadores biológicos de leitura rápida (auto-contidos) para vapor, a detecção fluorescente é baseada em qual enzima associada aos esporos?", options: ["catalase", "alfa-glucosidase", "urease", "amilase"], answer: 1, hint: "É uma enzima usada como marcador substituto da viabilidade do esporo." },
                { id: "cme-4-2-2", type: "mc", q: "Cargas processadas por óxido de etileno tipicamente requerem aeração mecânica a 50-60°C por aproximadamente:", options: ["30 minutos", "8 a 12 horas", "5 minutos", "48 a 72 horas, sem exceção"], answer: 1, hint: "É um período de horas, não minutos — e não chega a três dias." },
                { id: "cme-4-2-3", type: "mc", q: "Um 'fator de segurança' costuma ser aplicado sobre o D-value do microrganismo mais resistente, durante o desenvolvimento (não a rotina) de um ciclo, para compensar:", options: ["erros de digitação do fabricante", "variabilidade biológica e incerteza na determinação exata do D-value", "o custo do vapor", "o tempo de recarregamento do equipamento"], answer: 1, hint: "D-value é uma média experimental, não um número exato imutável." },
                { id: "cme-4-2-4", type: "mc", q: "Biofilme em superfícies de instrumentos é particularmente preocupante porque:", options: ["é sempre visível a olho nu, facilitando a detecção", "pode proteger microrganismos da ação de desinfetantes/esterilizantes, mesmo após limpeza aparente", "só se forma em plástico, nunca em metal", "desaparece sozinho com o tempo"], answer: 1, hint: "A matriz do biofilme funciona como uma barreira física." },
                { id: "cme-4-2-5", type: "text", q: "Qual classe de indicador químico (ISO 11140), numericamente, é chamada de 'integrador', reagindo a todos os parâmetros críticos do ciclo?", answer: "5", altAnswers: ["classe 5"], hint: "Fica entre a classe 4 (multiparamétrico) e a classe 6 (emulador)." }
              ]
            }
          ]
        },
        {
          id: "cme-f5", title: "Fase 5 · SUS e Saúde Pública",
          missions: [
            {
              id: "cme-5-1", title: "Princípios e Estrutura do SUS",
              explanation: "Ronda 8. Sai um pouco da CME e entra na estrutura do sistema.",
              exercises: [
                { id: "cme-5-1-1", type: "mc", q: "Os três princípios doutrinários do SUS são:", options: ["Eficiência, lucro e agilidade", "Universalidade, integralidade e equidade", "Hierarquia, disciplina e controle", "Privatização, terceirização e cogestão"], answer: 1, hint: "São a base filosófica do sistema, não os organizativos." },
                { id: "cme-5-1-2", type: "mc", q: "A Lei nº 8.080/1990 é conhecida como:", options: ["Lei Orgânica da Saúde", "Lei das Diretrizes Orçamentárias", "Estatuto do Idoso", "Lei da Vigilância Sanitária"], answer: 0, hint: "É a lei que estrutura o funcionamento do SUS." },
                { id: "cme-5-1-3", type: "truefalse", q: "\"O SUS atende apenas pessoas que não possuem plano de saúde privado.\"", answer: false, explain: "Pela universalidade, o SUS é direito de todos os cidadãos, tenham plano privado ou não." },
                { id: "cme-5-1-4", type: "mc", q: "A 'integralidade' no SUS significa:", options: ["atender só a doença principal do paciente", "considerar o indivíduo como um todo, com ações de promoção, prevenção e cura", "integrar hospitais públicos e privados num só", "cobrar integralmente pelos serviços"], answer: 1, hint: "Pense em cuidar da pessoa inteira, não só de um sintoma." },
                { id: "cme-5-1-5", type: "mc", q: "O controle social no SUS é exercido principalmente por meio de:", options: ["câmeras de vigilância nos hospitais", "conselhos e conferências de saúde com participação popular", "auditorias fiscais anuais", "pesquisas de satisfação em aplicativos"], answer: 1, hint: "É sobre a sociedade participar das decisões." },
              ],
            },
            {
              id: "cme-5-2", title: "Níveis de Atenção e Vigilância",
              explanation: "Ronda 9. Como o sistema se organiza na prática.",
              exercises: [
                { id: "cme-5-2-1", type: "mc", q: "A Atenção Primária à Saúde (APS) tem como principal porta de entrada:", options: ["o pronto-socorro do hospital", "a Unidade Básica de Saúde (UBS)", "a UTI", "o centro cirúrgico"], answer: 1, hint: "É o primeiro contato do cidadão com o sistema, no bairro." },
                { id: "cme-5-2-2", type: "order", q: "Ordene os níveis de complexidade da atenção à saúde, do menos ao mais complexo:", items: ["Atenção Primária (UBS)", "Atenção Secundária (especialidades)", "Atenção Terciária (alta complexidade)"], explain: "A lógica é encaminhar do mais simples e próximo para o mais complexo e especializado." },
                { id: "cme-5-2-3", type: "mc", q: "A Vigilância Epidemiológica é responsável por:", options: ["fiscalizar a qualidade de alimentos e medicamentos", "monitorar a ocorrência e distribuição de doenças na população", "cuidar da saúde do trabalhador apenas", "controlar o orçamento do hospital"], answer: 1, hint: "Pense em rastrear surtos e epidemias." },
                { id: "cme-5-2-4", type: "truefalse", q: "\"A Vigilância Sanitária e a Vigilância Epidemiológica são exatamente a mesma coisa.\"", answer: false, explain: "A Sanitária foca em produtos/serviços/ambientes; a Epidemiológica foca na ocorrência de doenças na população." },
                { id: "cme-5-2-5", type: "mc", q: "A ANVISA, no âmbito federal, é o órgão responsável por:", options: ["pagar os salários dos profissionais do SUS", "a vigilância sanitária de produtos e serviços de saúde", "construir hospitais", "formar médicos e enfermeiros"], answer: 1, hint: "O nome já entrega: Agência Nacional de Vigilância Sanitária." },
              ],
            },
          ],
        },
        {
          id: "cme-f6", title: "Fase 6 · Gestão em Saúde",
          missions: [
            {
              id: "cme-6-1", title: "Indicadores e Qualidade",
              explanation: "Ronda 10. Gestão é medir pra melhorar.",
              exercises: [
                { id: "cme-6-1-1", type: "mc", q: "A taxa de ocupação hospitalar é calculada pela relação entre:", options: ["número de médicos e número de pacientes", "leitos ocupados e leitos disponíveis, num período", "receita e despesa do hospital", "altas e óbitos"], answer: 1, hint: "É uma razão entre o que está ocupado e o total disponível." },
                { id: "cme-6-1-2", type: "mc", q: "'Tempo médio de permanência' é um indicador que mede:", options: ["quanto tempo o paciente espera na fila", "a média de dias que os pacientes ficam internados", "o tempo de duração das cirurgias", "a validade dos materiais estéreis"], answer: 1, hint: "Permanência = internação." },
                { id: "cme-6-1-3", type: "truefalse", q: "\"Uma taxa de infecção hospitalar mais baixa geralmente indica melhor qualidade assistencial.\"", answer: true, explain: "Taxas baixas de IRAS costumam refletir boas práticas de controle de infecção e segurança do paciente." },
                { id: "cme-6-1-4", type: "mc", q: "O ciclo PDCA, muito usado em gestão da qualidade, significa:", options: ["Planejar, Desenvolver, Cobrar, Auditar", "Plan, Do, Check, Act (Planejar, Fazer, Checar, Agir)", "Produzir, Distribuir, Controlar, Avaliar", "Prevenir, Diagnosticar, Cuidar, Acompanhar"], answer: 1, hint: "É um ciclo de melhoria contínua, de origem inglesa." },
                { id: "cme-6-1-5", type: "mc", q: "Acreditação hospitalar (ex: ONA) é:", options: ["uma obrigação fiscal do hospital", "um processo voluntário de avaliação da qualidade e segurança dos serviços", "o cadastro do hospital no SUS", "a contratação de funcionários"], answer: 1, hint: "É um selo de qualidade, geralmente voluntário." },
              ],
            },
            {
              id: "cme-6-2", title: "Segurança do Paciente",
              explanation: "Ronda 11. O tema que conecta CME, bloco e gestão.",
              exercises: [
                { id: "cme-6-2-1", type: "mc", q: "As metas internacionais de segurança do paciente incluem, entre outras:", options: ["aumentar o número de cirurgias por dia", "identificar corretamente o paciente e melhorar a higienização das mãos", "reduzir o número de funcionários", "acelerar as altas hospitalares"], answer: 1, hint: "São metas de segurança, não de produtividade." },
                { id: "cme-6-2-2", type: "match", q: "Associe cada 'M' das metas de segurança ao seu foco:", pairs: [
                  { left: "Higienização das mãos", right: "Reduzir infecções" },
                  { left: "Cirurgia segura (checklist)", right: "Evitar erro de sítio/procedimento" },
                  { left: "Identificação do paciente", right: "Evitar troca de pessoa" }
                ], explain: "Cada meta ataca um tipo específico de risco assistencial." },
                { id: "cme-6-2-3", type: "truefalse", q: "\"A notificação de um 'quase-erro' (near miss) é inútil, pois nenhum dano chegou a ocorrer.\"", answer: false, explain: "Near misses são valiosíssimos: revelam falhas no processo antes que causem dano real." },
                { id: "cme-6-2-4", type: "mc", q: "Um 'evento adverso' em saúde é definido como:", options: ["qualquer reclamação do paciente", "um dano não intencional decorrente da assistência, não da doença de base", "um atraso na alta hospitalar", "uma cirurgia bem-sucedida"], answer: 1, hint: "A palavra-chave é 'dano decorrente da assistência'." },
                { id: "cme-6-2-5", type: "mc", q: "A cultura de segurança 'justa' (just culture) propõe que, diante de um erro, o foco inicial seja:", options: ["punir imediatamente o profissional envolvido", "entender as falhas do sistema/processo, sem culpabilização automática", "esconder o ocorrido para proteger a instituição", "demitir o gestor responsável"], answer: 1, hint: "É sobre aprender com o processo, não caçar culpados." },
              ],
            },
          ],
        },
        {
          id: "cme-f7", title: "Fase 7 · Bloco Cirúrgico",
          missions: [
            {
              id: "cme-7-1", title: "Fluxos e Zonas do Centro Cirúrgico",
              explanation: "Ronda 12. O coração cirúrgico do hospital.",
              exercises: [
                { id: "cme-7-1-1", type: "mc", q: "No centro cirúrgico, a divisão clássica em zonas (irrestrita, semirrestrita e restrita) serve para:", options: ["organizar o estacionamento", "controlar a circulação de pessoas e materiais conforme o risco de contaminação", "definir salários por área", "separar cirurgiões de enfermeiros"], answer: 1, hint: "É sobre controle de contaminação por área." },
                { id: "cme-7-1-2", type: "mc", q: "A sala de cirurgia propriamente dita pertence à zona:", options: ["irrestrita", "semirrestrita", "restrita", "externa"], answer: 2, hint: "É a área de maior controle, onde se exige paramentação completa." },
                { id: "cme-7-1-3", type: "order", q: "Ordene as etapas do tempo cirúrgico de forma geral:", items: ["Pré-operatório (preparo)", "Trans-operatório (a cirurgia em si)", "Pós-operatório (recuperação)"], explain: "Antes, durante e depois — a lógica temporal da assistência cirúrgica." },
                { id: "cme-7-1-4", type: "truefalse", q: "\"O checklist de cirurgia segura da OMS deve ser aplicado em três momentos: antes da indução anestésica, antes da incisão e antes do paciente sair da sala.\"", answer: true, explain: "São os três momentos: sign in, time out e sign out." },
                { id: "cme-7-1-5", type: "mc", q: "A instrumentação cirúrgica é a função de:", options: ["anestesiar o paciente", "organizar e fornecer os instrumentais ao cirurgião durante o ato operatório", "limpar a sala após a cirurgia", "agendar as cirurgias"], answer: 1, hint: "É quem 'passa o bisturi' e controla a mesa de instrumentais." },
              ],
            },
            {
              id: "cme-7-2", title: "Paramentação e Antissepsia",
              explanation: "Ronda 13. Barreira estéril na prática.",
              exercises: [
                { id: "cme-7-2-1", type: "mc", q: "A degermação cirúrgica das mãos e antebraços tem como objetivo:", options: ["apenas deixar as mãos com cheiro agradável", "reduzir a flora transitória e diminuir a flora residente antes da cirurgia", "substituir o uso de luvas", "esterilizar a pele completamente"], answer: 1, hint: "Pele não se esteriliza — se reduz a carga microbiana." },
                { id: "cme-7-2-2", type: "match", q: "Associe cada antisséptico ao seu uso/característica comum:", pairs: [
                  { left: "Clorexidina", right: "Efeito residual prolongado" },
                  { left: "Álcool 70%", right: "Ação rápida, sem efeito residual" },
                  { left: "Iodopovidona (PVPI)", right: "Amplo espectro, à base de iodo" }
                ], explain: "Cada antisséptico tem perfil de ação e permanência diferentes." },
                { id: "cme-7-2-3", type: "truefalse", q: "\"Depois de paramentado e com luvas estéreis, o profissional pode encostar livremente em qualquer superfície da sala.\"", answer: false, explain: "Só se pode tocar o campo estéril; tocar superfícies não estéreis contamina a paramentação." },
                { id: "cme-7-2-4", type: "mc", q: "A ordem correta de paramentação cirúrgica estéril, em geral, é:", options: ["luva antes do capote", "degermação → capote estéril → luvas estéreis", "luvas → degermação → capote", "capote comum → luvas comuns"], answer: 1, hint: "Primeiro as mãos limpas, depois o avental, por fim as luvas." },
                { id: "cme-7-2-5", type: "mc", scenario: "Durante a montagem da mesa cirúrgica, a instrumentadora percebe que a ponta de uma pinça encostou por um instante na borda externa (não estéril) da mesa auxiliar.", q: "Qual a conduta correta?", options: ["Ignorar, pois foi só um instante", "Considerar a pinça contaminada e substituí-la por uma estéril", "Passar álcool na pinça e continuar usando", "Continuar, desde que ninguém tenha visto"], answer: 1, explain: "Barreira estéril é binária: contato com área não estéril = item contaminado, sem meio-termo." },
              ],
            },
          ],
        }
      ]
    }
  ]
};

/* ============================================================
   DAILY_TRIVIA — curiosidades leves de aquecimento diário
   (mantidas propositalmente mais leves que o quiz principal —
   funcionam como intervalo, não como parte do desafio técnico).
   ============================================================ */
const DAILY_TRIVIA = [
  { id: "tv-1", category: "CME", text: "A esterilização elimina todos os microrganismos, inclusive esporos.", isTrue: true, explain: "É justamente a diferença entre esterilização e desinfecção: esterilização é o nível máximo." },
  { id: "tv-2", category: "CME", text: "Álcool 70% é considerado um método de esterilização.", isTrue: false, explain: "O álcool 70% é um desinfetante — não elimina esporos bacterianos resistentes." },
  { id: "tv-3", category: "CME", text: "A autoclave a vapor costuma ser mais barata de operar que o óxido de etileno.", isTrue: true, explain: "Por isso a autoclave é o método mais usado sempre que o material aguenta calor e umidade." },
  { id: "tv-4", category: "CME", text: "Todo material usado em cirurgia pode ser processado apenas com álcool 70%.", isTrue: false, explain: "Artigos críticos exigem esterilização completa, não apenas desinfecção." },
  { id: "tv-5", category: "História do Brasil", text: "O Brasil foi 'descoberto' pelos portugueses em 1500, liderados por Pedro Álvares Cabral.", isTrue: true, explain: "A esquadra portuguesa chegou à costa da Bahia em abril de 1500." },
  { id: "tv-6", category: "História do Brasil", text: "A capital do Brasil sempre foi Brasília, desde o início da colonização.", isTrue: false, explain: "Antes de Brasília (1960), a capital já foi Salvador e depois o Rio de Janeiro." },
  { id: "tv-7", category: "História do Brasil", text: "A Proclamação da Independência do Brasil aconteceu em 1822.", isTrue: true, explain: "Foi Dom Pedro I quem proclamou, às margens do rio Ipiranga." },
  { id: "tv-8", category: "História do Brasil", text: "Dom Pedro II foi o primeiro imperador do Brasil.", isTrue: false, explain: "O primeiro foi Dom Pedro I — Dom Pedro II foi seu filho, o segundo imperador." },
  { id: "tv-9", category: "Curiosidades", text: "O coração humano bate, em média, mais de 100 mil vezes por dia.", isTrue: true, explain: "Em repouso, o coração bate cerca de 60 a 100 vezes por minuto — somando o dia todo, passa de 100 mil batidas!" },
  { id: "tv-10", category: "Curiosidades", text: "Os polvos têm três corações.", isTrue: true, explain: "Dois corações bombeiam sangue para as brânquias, e um terceiro para o resto do corpo." },
  { id: "tv-11", category: "Curiosidades", text: "A luz do Sol demora cerca de 8 minutos para chegar à Terra.", isTrue: true, explain: "Mesmo viajando na velocidade da luz, a distância até o Sol é enorme." },
  { id: "tv-12", category: "Curiosidades", text: "Todos os planetas do Sistema Solar têm anéis, como Saturno.", isTrue: false, explain: "Só alguns planetas gasosos têm anéis — a Terra e Marte não têm." },
  { id: "tv-13", category: "Curiosidades", text: "O corpo humano adulto tem 206 ossos.", isTrue: true, explain: "Bebês nascem com mais ossos, que vão se fundindo ao longo do crescimento." },
  { id: "tv-14", category: "Curiosidades", text: "A Grande Muralha da China pode ser vista a olho nu do espaço.", isTrue: false, explain: "Isso é um mito popular — astronautas confirmam que ela não é visível a olho nu do espaço." }
];

/* ============================================================
   FEYNMAN_TOPICS — modo "Ensine o Sistema" (opcional)
   ============================================================ */
const FEYNMAN_TOPICS = [
  {
    id: "fey-fluxo-cme", subjectId: "cme", title: "Fluxo da CME",
    prompt: "Explique com suas próprias palavras as etapas do processamento de um artigo na CME, do início ao fim.",
    keywords: ["recepção", "limpeza", "preparo", "esterilização", "armazenamento", "distribuição"]
  },
  {
    id: "fey-sal", subjectId: "cme", title: "SAL e D-value",
    prompt: "Explique com suas próprias palavras o que é SAL (Sterility Assurance Level) e como o D-value se relaciona com ele.",
    keywords: ["probabilidade", "sobrevivência", "log", "redução", "10", "esporo", "tempo", "temperatura"]
  }
];
