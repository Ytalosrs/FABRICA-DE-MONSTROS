// =====================================================================
// COLABORADORES — editável.
// Cada item vira: (1) uma conta no Authentication e (2) um documento
// na coleção `users`, JÁ no nível correto (ninguém recomeça do zero).
//
// Campos:
//   nome              -> nome completo
//   email             -> DEVE terminar com @zello.tec.br
//   nivel             -> 0, 1, 2 ou 3 (vira `nivelAtual`)
//   trilha            -> id da trilha (veja scripts/data/trilhas.js)
//   senhaTemporaria   -> senha inicial (a pessoa troca depois)
//
// Dica: use uma senha temporária forte e padronizada, e peça para
// trocarem no primeiro acesso.
// =====================================================================

export const COLABORADORES = [
  // --- Exemplos (troque pelos reais) ---
  { nome: 'Ana Souza',     email: 'ana.souza@zello.tec.br',   nivel: 2, trilha: 'flutterflow', senhaTemporaria: 'Zello@Trilha2026' },
  { nome: 'Bruno Lima',    email: 'bruno.lima@zello.tec.br',  nivel: 1, trilha: 'flutterflow', senhaTemporaria: 'Zello@Trilha2026' },
  { nome: 'Carla Nunes',   email: 'carla.nunes@zello.tec.br', nivel: 3, trilha: 'automacao',   senhaTemporaria: 'Zello@Trilha2026' },
  { nome: 'Diego Alves',   email: 'diego.alves@zello.tec.br', nivel: 2, trilha: 'automacao',   senhaTemporaria: 'Zello@Trilha2026' },
  { nome: 'Eduardo Reis',  email: 'eduardo.reis@zello.tec.br',nivel: 1, trilha: 'automacao',   senhaTemporaria: 'Zello@Trilha2026' },
  { nome: 'Fabiana Cruz',  email: 'fabiana.cruz@zello.tec.br',nivel: 0, trilha: 'iniciante_n0',senhaTemporaria: 'Zello@Trilha2026' },
];

// Duplas de mentoria ATIVAS (mentor N2 -> afilhado N1, mesma trilha).
// Use os e-mails acima; o script resolve os IDs automaticamente.
export const MENTORIAS = [
  { mentorEmail: 'ana.souza@zello.tec.br',  afilhadoEmail: 'bruno.lima@zello.tec.br',   trilha: 'flutterflow' },
  { mentorEmail: 'diego.alves@zello.tec.br',afilhadoEmail: 'eduardo.reis@zello.tec.br', trilha: 'automacao' },
];
