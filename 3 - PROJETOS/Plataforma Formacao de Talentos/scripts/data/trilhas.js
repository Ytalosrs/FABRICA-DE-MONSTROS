// =====================================================================
// DADOS DAS TRILHAS — editável.
// Cada trilha vira um documento na coleção `tracks` do Firestore.
//
// ESTRUTURA de cada módulo/conteúdo:
//   {
//     ordem: 1,
//     titulo: 'Nome do módulo',
//     descricao: 'Resumo do módulo',
//     conteudos: [
//       { tipo: 'video', titulo: 'Aula 1', url: 'https://...', duracao: '12min' },
//       { tipo: 'texto', titulo: 'Leitura',  url: 'https://...', duracao: '8min'  },
//       { tipo: 'quiz',  titulo: 'Exercício', url: '',            duracao: '15min' },
//     ],
//   }
//
// Para ADICIONAR UMA NOVA TRILHA: copie um bloco abaixo, troque o `id`
// (sem espaços/acentos), preencha os módulos e rode `npm run db:seed`.
// =====================================================================

export const TRILHAS = [
  // -------------------------------------------------------------------
  // NÍVEL 0 — Base obrigatória (conteúdo real já preenchido)
  // -------------------------------------------------------------------
  {
    id: 'iniciante_n0',
    nome: 'Trilha Tech 360 · TI do Zero',
    nivel: 0,
    ordem: 0,
    icone: 'Sparkles',
    descricao:
      'Base obrigatória para todos: da história da computação à lógica e aos bancos de dados.',
    modulos: [
      {
        ordem: 1,
        titulo: 'História e Evolução da TI',
        descricao: 'Do ábaco aos microprocessadores.',
        conteudos: [
          { tipo: 'texto', titulo: 'Do ábaco às engrenagens mecânicas (Pascaline, Babbage, cartões perfurados)', url: '', duracao: '10min' },
          { tipo: 'texto', titulo: 'Eras: Válvulas (ENIAC) → Transistores → Circuitos Integrados → Microprocessadores', url: '', duracao: '10min' },
        ],
      },
      {
        ordem: 2,
        titulo: 'O que é um Computador (Hardware vs. Software)',
        descricao: 'Ciclo IPO e anatomia da máquina.',
        conteudos: [
          { tipo: 'texto', titulo: 'Ciclo IPO (Entrada, Processamento, Saída, Armazenamento)', url: '', duracao: '8min' },
          { tipo: 'texto', titulo: 'Anatomia: CPU, Placa-mãe, RAM, HD/SSD e periféricos', url: '', duracao: '12min' },
        ],
      },
      {
        ordem: 3,
        titulo: 'Como o Computador Pensa (Lógica Elétrica e Binária)',
        descricao: 'Bits, bytes e tradução de instruções.',
        conteudos: [
          { tipo: 'texto', titulo: 'Bits (0/1) e Bytes (8 bits / 256 combinações)', url: '', duracao: '10min' },
          { tipo: 'texto', titulo: 'Tradução de instruções e introdução a algoritmos', url: '', duracao: '10min' },
        ],
      },
      {
        ordem: 4,
        titulo: 'Fundamentos de Lógica e Programação',
        descricao: 'Algoritmos como "receita de bolo".',
        conteudos: [
          { tipo: 'texto', titulo: 'Conceito de algoritmo (receita de bolo)', url: '', duracao: '8min' },
          { tipo: 'texto', titulo: 'Variáveis, constantes, tipos de dados e fluxo de execução', url: '', duracao: '12min' },
        ],
      },
      {
        ordem: 5,
        titulo: 'Dados, Informações e Bancos de Dados',
        descricao: 'Da pirâmide do conhecimento às chaves.',
        conteudos: [
          { tipo: 'texto', titulo: 'Pirâmide do Conhecimento: Dado → Informação → Conhecimento → Inteligência', url: '', duracao: '10min' },
          { tipo: 'texto', titulo: 'Entidades, modelagem e chaves primárias/estrangeiras', url: '', duracao: '12min' },
        ],
      },
      {
        ordem: 6,
        titulo: 'Avaliação de Passagem (Certificação Nível 0)',
        descricao: 'Libera a escolha da Trilha Técnica do Nível 1.',
        conteudos: [
          { tipo: 'quiz', titulo: 'Prova: computação e lógica (objetivas + discursivas)', url: '', duracao: '40min' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // NÍVEL 1 — 10 trilhas técnicas
  // TODO: preencha os `modulos` de cada uma com o conteúdo real.
  // (deixei `analista` com 1 módulo de exemplo pra mostrar o formato)
  // -------------------------------------------------------------------
  {
    id: 'analista',
    nome: 'Analista',
    nivel: 1,
    ordem: 1,
    icone: 'LineChart',
    descricao: 'Fundamentos de análise de dados e indicadores.',
    modulos: [
      {
        ordem: 1,
        titulo: 'Introdução à Análise de Dados',
        descricao: 'Exemplo de módulo — troque pelo conteúdo real.',
        conteudos: [
          { tipo: 'video', titulo: 'Aula 1 — Panorama', url: '', duracao: '12min' },
          { tipo: 'quiz', titulo: 'Exercício do módulo 1', url: '', duracao: '15min' },
        ],
      },
    ],
  },
  { id: 'automacao', nome: 'Automação', nivel: 1, ordem: 2, icone: 'Workflow', descricao: 'Automação de processos e integração de fluxos.', modulos: [] },
  { id: 'flutterflow', nome: 'FlutterFlow', nivel: 1, ordem: 3, icone: 'Smartphone', descricao: 'Criação de aplicativos low-code com FlutterFlow.', modulos: [] },
  { id: 'ia-agentica', nome: 'IA Agêntica', nivel: 1, ordem: 4, icone: 'Bot', descricao: 'Agentes autônomos e orquestração de IA.', modulos: [] },
  { id: 'kubernetes', nome: 'Kubernetes', nivel: 1, ordem: 5, icone: 'Container', descricao: 'Orquestração de contêineres em produção.', modulos: [] },
  { id: 'mulesoft-associate', nome: 'Mulesoft Associate', nivel: 1, ordem: 6, icone: 'Plug', descricao: 'Fundamentos de integração com Mulesoft.', modulos: [] },
  { id: 'mulesoft-dev1', nome: 'Mulesoft Dev 1', nivel: 1, ordem: 7, icone: 'Boxes', descricao: 'Desenvolvimento de APIs e conectores Mulesoft.', modulos: [] },
  { id: 'qlik-replicate', nome: 'Qlik Replicate', nivel: 1, ordem: 8, icone: 'DatabaseZap', descricao: 'Replicação e ingestão de dados em tempo real.', modulos: [] },
  { id: 'qlik-sense-ba', nome: 'Qlik Sense: Business Analyst', nivel: 1, ordem: 9, icone: 'PieChart', descricao: 'Dashboards e storytelling de dados no Qlik Sense.', modulos: [] },
  { id: 'salesforce-associate', nome: 'Salesforce Associate', nivel: 1, ordem: 10, icone: 'Cloud', descricao: 'Fundamentos da plataforma Salesforce.', modulos: [] },
];
