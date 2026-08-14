// =====================================================================
// SEÇÃO 3 — FUNÇÃO DE AUTOMAÇÃO DE MENTORIA (TypeScript)
// Regra de negócio simulada:
//   (A) Match automático de um mentor N2 com um afilhado N1 da MESMA trilha.
//   (B) Promoção automática do mentor N2 -> N3 quando o afilhado é
//       certificado no N1 e sobe para N2.
//
// As funções são puras/determinísticas (recebem estado, devolvem estado)
// para poderem rodar tanto no front (simulação) quanto numa Edge Function
// do Supabase. Substitua os arrays em memória por queries reais.
// =====================================================================

export type Nivel = 'N0' | 'N1' | 'N2' | 'N3';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatarUrl?: string;
  nivel: Nivel;
  trilhaId: string | null; // trilha técnica atual
  ativo: boolean;
}

export interface Mentoria {
  id: string;
  mentorId: string;
  afilhadoId: string;
  trilhaId: string;
  squad?: string;
  status: 'ativa' | 'concluida' | 'cancelada';
  vinculadaEm: string;
  concluidaEm?: string;
}

export interface EstadoPlataforma {
  usuarios: Usuario[];
  mentorias: Mentoria[];
}

// Gerador de id determinístico (evita depender de Math.random em SSR/edge).
let _seq = 0;
const novoId = (prefixo: string) => `${prefixo}_${(++_seq).toString(36)}`;

// ---------------------------------------------------------------------
// (A) MATCH AUTOMÁTICO — vincula um mentor N2 a um afilhado N1 da mesma trilha
// ---------------------------------------------------------------------
/**
 * Quando um usuário é certificado no N1 e sobe para N2, o sistema procura
 * um afilhado elegível: alguém cursando a MESMA trilha, ainda no N1 e que
 * não possua mentoria ativa. Retorna o novo estado + a mentoria criada.
 */
export function vincularAfilhadoAutomaticamente(
  estado: EstadoPlataforma,
  mentorId: string,
  agora: string,
): { estado: EstadoPlataforma; mentoria: Mentoria | null; motivo?: string } {
  const mentor = estado.usuarios.find((u) => u.id === mentorId);

  if (!mentor) return { estado, mentoria: null, motivo: 'Mentor inexistente.' };
  if (mentor.nivel !== 'N2')
    return { estado, mentoria: null, motivo: 'Mentor precisa estar no Nível 2.' };
  if (!mentor.trilhaId)
    return { estado, mentoria: null, motivo: 'Mentor sem trilha definida.' };

  // Mentor já ocupado? (uma dupla ativa por mentor)
  const jaMentora = estado.mentorias.some(
    (m) => m.mentorId === mentorId && m.status === 'ativa',
  );
  if (jaMentora)
    return { estado, mentoria: null, motivo: 'Mentor já possui afilhado ativo.' };

  // Afilhados que já estão em alguma mentoria ativa (não podem ser realocados).
  const afilhadosOcupados = new Set(
    estado.mentorias.filter((m) => m.status === 'ativa').map((m) => m.afilhadoId),
  );

  // Elegível: N1, mesma trilha, ativo e livre. Prioriza o mais "antigo" (ordem do array).
  const afilhado = estado.usuarios.find(
    (u) =>
      u.nivel === 'N1' &&
      u.trilhaId === mentor.trilhaId &&
      u.ativo &&
      u.id !== mentor.id &&
      !afilhadosOcupados.has(u.id),
  );

  if (!afilhado)
    return {
      estado,
      mentoria: null,
      motivo: 'Nenhum aluno N1 disponível nesta trilha no momento.',
    };

  const mentoria: Mentoria = {
    id: novoId('men'),
    mentorId: mentor.id,
    afilhadoId: afilhado.id,
    trilhaId: mentor.trilhaId,
    squad: `Squad ${mentor.trilhaId.toUpperCase()}`,
    status: 'ativa',
    vinculadaEm: agora,
  };

  return {
    estado: { ...estado, mentorias: [...estado.mentorias, mentoria] },
    mentoria,
  };
}

// ---------------------------------------------------------------------
// (B) CERTIFICAÇÃO DO AFILHADO -> PROMOÇÕES EM CASCATA
// ---------------------------------------------------------------------
/**
 * Dispara quando o afilhado (N1) passa na certificação:
 *   1. Afilhado sobe N1 -> N2.
 *   2. Encerra a mentoria (status 'concluida').
 *   3. Mentor N2 é promovido automaticamente para N3 (Especialista de Suporte).
 *   4. O ex-afilhado (agora N2) recebe seu próprio afilhado via match automático.
 */
export function certificarAfilhadoEPromover(
  estado: EstadoPlataforma,
  afilhadoId: string,
  agora: string,
): {
  estado: EstadoPlataforma;
  eventos: string[];
} {
  const eventos: string[] = [];
  const mentoria = estado.mentorias.find(
    (m) => m.afilhadoId === afilhadoId && m.status === 'ativa',
  );

  let usuarios = estado.usuarios.map((u) => ({ ...u }));
  let mentorias = estado.mentorias.map((m) => ({ ...m }));

  // 1. Afilhado N1 -> N2
  const afilhado = usuarios.find((u) => u.id === afilhadoId);
  if (!afilhado) return { estado, eventos: ['Afilhado inexistente.'] };
  if (afilhado.nivel !== 'N1')
    return { estado, eventos: ['Afilhado não está no Nível 1.'] };

  afilhado.nivel = 'N2';
  eventos.push(`✅ ${afilhado.nome} foi certificado(a) e promovido(a) N1 → N2.`);

  // 2 + 3. Encerrar mentoria e promover o mentor N2 -> N3
  if (mentoria) {
    const idx = mentorias.findIndex((m) => m.id === mentoria.id);
    mentorias[idx] = { ...mentorias[idx], status: 'concluida', concluidaEm: agora };

    const mentor = usuarios.find((u) => u.id === mentoria.mentorId);
    if (mentor && mentor.nivel === 'N2') {
      mentor.nivel = 'N3';
      eventos.push(
        `🏅 ${mentor.nome} concluiu o apadrinhamento e foi promovido(a) N2 → N3 (Especialista de Suporte).`,
      );
    }
  } else {
    eventos.push('ℹ️ Afilhado sem mentoria ativa registrada.');
  }

  // 4. O ex-afilhado (agora N2) ganha seu próprio afilhado.
  let estadoAtual: EstadoPlataforma = { usuarios, mentorias };
  const match = vincularAfilhadoAutomaticamente(estadoAtual, afilhadoId, agora);
  estadoAtual = match.estado;

  if (match.mentoria) {
    const novoAfilhado = estadoAtual.usuarios.find(
      (u) => u.id === match.mentoria!.afilhadoId,
    );
    eventos.push(
      `🤝 ${afilhado.nome} (N2) recebeu ${novoAfilhado?.nome ?? 'um novo aluno'} para mentorar.`,
    );
  } else if (match.motivo) {
    eventos.push(`⏳ ${afilhado.nome} entrou no Squad, aguardando aluno: ${match.motivo}`);
  }

  return { estado: estadoAtual, eventos };
}

// ---------------------------------------------------------------------
// Utilitário: promove um usuário N1 -> N2 após certificação própria
// e imediatamente busca um afilhado (ponto de entrada do fluxo).
// ---------------------------------------------------------------------
export function certificarN1(
  estado: EstadoPlataforma,
  usuarioId: string,
  agora: string,
): { estado: EstadoPlataforma; eventos: string[] } {
  const eventos: string[] = [];
  const usuarios = estado.usuarios.map((u) =>
    u.id === usuarioId && u.nivel === 'N1' ? { ...u, nivel: 'N2' as Nivel } : { ...u },
  );
  const alvo = usuarios.find((u) => u.id === usuarioId);
  if (alvo?.nivel === 'N2')
    eventos.push(`✅ ${alvo.nome} passou na Certificação N1 e subiu para N2.`);

  const match = vincularAfilhadoAutomaticamente(
    { usuarios, mentorias: estado.mentorias },
    usuarioId,
    agora,
  );
  if (match.mentoria) {
    const af = match.estado.usuarios.find((u) => u.id === match.mentoria!.afilhadoId);
    eventos.push(`🤝 ${alvo?.nome} recebeu ${af?.nome ?? 'um afilhado'} para mentorar.`);
  } else if (match.motivo) {
    eventos.push(`⏳ ${match.motivo}`);
  }

  return { estado: match.estado, eventos };
}
