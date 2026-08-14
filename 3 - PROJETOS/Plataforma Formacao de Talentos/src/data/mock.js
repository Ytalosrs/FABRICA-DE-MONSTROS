// =====================================================================
// DADOS MOCK — simulam as tabelas do Supabase para o protótipo.
// =====================================================================
import {
  Sparkles,
  LineChart,
  Workflow,
  Smartphone,
  Bot,
  Container,
  Plug,
  Boxes,
  DatabaseZap,
  PieChart,
  Cloud,
  History,
  Cpu,
  Binary,
  Code2,
  Database,
  ClipboardCheck,
} from 'lucide-react';

// Base obrigatória (N0) + 10 trilhas técnicas (N1).
export const TRILHAS = [
  { id: 'iniciante', nome: 'Trilha - Iniciante', nivelAlvo: 'N0', isBase: true, icon: Sparkles, cor: '#06B6D4', descricao: 'Alfabetização digital e lógica inicial. Obrigatória para todos.' },
  { id: 'analista', nome: 'Trilha - Analista', nivelAlvo: 'N1', icon: LineChart, cor: '#3B82F6', descricao: 'Fundamentos de análise de dados e indicadores.' },
  { id: 'automacao', nome: 'Trilha - Automação', nivelAlvo: 'N1', icon: Workflow, cor: '#3B82F6', descricao: 'Automação de processos e integração de fluxos.' },
  { id: 'flutterflow', nome: 'Trilha - FlutterFlow', nivelAlvo: 'N1', icon: Smartphone, cor: '#3B82F6', descricao: 'Criação de aplicativos low-code com FlutterFlow.' },
  { id: 'ia-agentica', nome: 'Trilha - IA Agêntica', nivelAlvo: 'N1', icon: Bot, cor: '#3B82F6', descricao: 'Agentes autônomos e orquestração de IA.' },
  { id: 'kubernetes', nome: 'Trilha - Kubernetes', nivelAlvo: 'N1', icon: Container, cor: '#3B82F6', descricao: 'Orquestração de contêineres em produção.' },
  { id: 'mulesoft-associate', nome: 'Trilha - Mulesoft Associate', nivelAlvo: 'N1', icon: Plug, cor: '#3B82F6', descricao: 'Fundamentos de integração com Mulesoft.' },
  { id: 'mulesoft-dev1', nome: 'Trilha - Mulesoft Dev 1', nivelAlvo: 'N1', icon: Boxes, cor: '#3B82F6', descricao: 'Desenvolvimento de APIs e conectores Mulesoft.' },
  { id: 'qlik-replicate', nome: 'Trilha - Qlik Replicate', nivelAlvo: 'N1', icon: DatabaseZap, cor: '#3B82F6', descricao: 'Replicação e ingestão de dados em tempo real.' },
  { id: 'qlik-sense-ba', nome: 'Trilha - Qlik Sense: Business Analyst', nivelAlvo: 'N1', icon: PieChart, cor: '#3B82F6', descricao: 'Dashboards e storytelling de dados no Qlik Sense.' },
  { id: 'salesforce-associate', nome: 'Trilha - Salesforce Associate', nivelAlvo: 'N1', icon: Cloud, cor: '#3B82F6', descricao: 'Fundamentos da plataforma Salesforce.' },
];

export const TRILHAS_TECNICAS = TRILHAS.filter((t) => !t.isBase);
export const trilhaPorId = (id) => TRILHAS.find((t) => t.id === id);

// Nome comercial da trilha base (Nível 0).
export const N0_NOME = 'Trilha Tech 360 · TI do Zero';

// Módulos passo a passo do Nível 0 (grade real "Trilha Tech 360 / TI do Zero").
export const MODULOS_N0 = [
  {
    id: 'm1',
    num: 1,
    titulo: 'História e Evolução da TI',
    desc: 'Do ábaco aos microprocessadores.',
    status: 'nao_iniciado',
    icon: History,
    topicos: [
      'Do ábaco às engrenagens mecânicas (Pascaline, Máquina Analítica de Babbage, cartões perfurados).',
      'Eras dos computadores: Válvulas (ENIAC) → Transistores → Circuitos Integrados → Microprocessadores.',
    ],
  },
  {
    id: 'm2',
    num: 2,
    titulo: 'O que é um Computador (Hardware vs. Software)',
    desc: 'Ciclo IPO e anatomia da máquina.',
    status: 'nao_iniciado',
    icon: Cpu,
    topicos: [
      'Entendimento do ciclo IPO (Entrada, Processamento, Saída, Armazenamento).',
      'Anatomia da máquina: CPU, Placa-mãe, Memória RAM, HD/SSD e periféricos.',
    ],
  },
  {
    id: 'm3',
    num: 3,
    titulo: 'Como o Computador Pensa (Lógica Elétrica e Binária)',
    desc: 'Bits, bytes e tradução de instruções.',
    status: 'nao_iniciado',
    icon: Binary,
    topicos: [
      'Bits (0/1) e Bytes (8 bits / 256 combinações).',
      'Tradução de instruções e introdução a algoritmos.',
    ],
  },
  {
    id: 'm4',
    num: 4,
    titulo: 'Fundamentos de Lógica e Programação',
    desc: 'Algoritmos como "receita de bolo".',
    status: 'nao_iniciado',
    icon: Code2,
    topicos: [
      'Conceito de algoritmo como "receita de bolo".',
      'Variáveis, constantes, tipos de dados e fluxo de execução.',
    ],
  },
  {
    id: 'm5',
    num: 5,
    titulo: 'Dados, Informações e Bancos de Dados',
    desc: 'Da pirâmide do conhecimento às chaves.',
    status: 'nao_iniciado',
    icon: Database,
    topicos: [
      'Pirâmide do Conhecimento: Dado → Informação → Conhecimento → Inteligência.',
      'Atributos, Entidades e Modelagem (Lógica/Conceitual).',
      'Chaves Primárias e Chaves Estrangeiras.',
    ],
  },
  {
    id: 'm6',
    num: 6,
    titulo: 'Avaliação de Passagem (Certificação Nível 0)',
    desc: 'Teste que libera a escolha da Trilha Técnica N1.',
    status: 'nao_iniciado',
    icon: ClipboardCheck,
    isAvaliacao: true,
    topicos: [
      'Banco de questões discursivas e objetivas.',
      'Cobre conceitos gerais de computação e lógica.',
      'A aprovação libera a escolha da Trilha Técnica do Nível 1.',
    ],
  },
];

// Módulos genéricos de uma trilha técnica (N1).
export const MODULOS_N1 = [
  { id: 't1', titulo: 'Conceitos fundamentais', desc: 'Base teórica da trilha.', status: 'nao_iniciado' },
  { id: 't2', titulo: 'Ferramentas e ambiente', desc: 'Configuração e primeiros exercícios.', status: 'nao_iniciado' },
  { id: 't3', titulo: 'Projeto prático guiado', desc: 'Aplicação em caso real.', status: 'nao_iniciado' },
  { id: 't4', titulo: 'Boas práticas e otimização', desc: 'Qualidade e performance.', status: 'nao_iniciado' },
  { id: 't5', titulo: 'Preparação para a certificação', desc: 'Revisão e simulados.', status: 'nao_iniciado' },
];

// Colaboradores (usuarios). Vazio: ninguém começou ainda.
export const USUARIOS = [];

// Duplas de mentoria ativas (mentor N2 -> afilhado N1). Vazio: nada ainda.
export const MENTORIAS = [];

// Fila de dúvidas para o Especialista N3. Vazio: nada ainda.
export const FILA_DUVIDAS = [];
