// =====================================================================
// dbService.js — Camada de acesso ao Cloud Firestore
// Coleções: users, tracks, user_progress, mentorships.
// Cada função opera no Firestore real ou, em MODO DEMO, num store local.
// =====================================================================
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase.js';

// Trilha base (Nível 0) que todo colaborador recebe ao se cadastrar.
export const TRILHA_INICIAL_ID = 'iniciante_n0';

// ---------------------------------------------------------------------
// SEED DE TRILHAS (coleção `tracks`)
// ---------------------------------------------------------------------
export const TRACKS_SEED = [
  {
    id: TRILHA_INICIAL_ID,
    nome: 'Trilha Tech 360 · TI do Zero',
    nivel: 0,
    modulos: [
      { id: 'm1', ordem: 1, titulo: 'História e Evolução da TI' },
      { id: 'm2', ordem: 2, titulo: 'O que é um Computador (Hardware vs. Software)' },
      { id: 'm3', ordem: 3, titulo: 'Como o Computador Pensa (Binário/Algoritmos)' },
      { id: 'm4', ordem: 4, titulo: 'Fundamentos de Lógica de Programação' },
      { id: 'm5', ordem: 5, titulo: 'Dados, Informações e Bancos de Dados' },
    ],
  },
  // 10 trilhas técnicas (Nível 1)
  { id: 'analista', nome: 'Analista', nivel: 1, modulos: [] },
  { id: 'automacao', nome: 'Automação', nivel: 1, modulos: [] },
  { id: 'flutterflow', nome: 'FlutterFlow', nivel: 1, modulos: [] },
  { id: 'ia-agentica', nome: 'IA Agêntica', nivel: 1, modulos: [] },
  { id: 'kubernetes', nome: 'Kubernetes', nivel: 1, modulos: [] },
  { id: 'mulesoft-associate', nome: 'Mulesoft Associate', nivel: 1, modulos: [] },
  { id: 'mulesoft-dev1', nome: 'Mulesoft Dev 1', nivel: 1, modulos: [] },
  { id: 'qlik-replicate', nome: 'Qlik Replicate', nivel: 1, modulos: [] },
  { id: 'qlik-sense-ba', nome: 'Qlik Sense: Business Analyst', nivel: 1, modulos: [] },
  { id: 'salesforce-associate', nome: 'Salesforce Associate', nivel: 1, modulos: [] },
];

// =====================================================================
// COLEÇÃO: users
// =====================================================================
/** Cria/atualiza o documento do usuário (registro ou perfil de teste). */
export async function criarPerfilUsuario({
  uid,
  nome,
  email,
  nivelAtual = 0,
  trilhaAtivaId = TRILHA_INICIAL_ID,
}) {
  const base = {
    uid,
    nome,
    email,
    nivelAtual,
    trilhaAtivaId,
  };
  if (!isFirebaseConfigured) {
    return demoSet('users', uid, { ...base, criadoEm: new Date().toISOString() });
  }
  await setDoc(
    doc(db, 'users', uid),
    { ...base, criadoEm: serverTimestamp() },
    { merge: true },
  );
  return base;
}

export async function getUserProfile(uid) {
  if (!isFirebaseConfigured) return demoGet('users', uid);
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserLevel(uid, newLevel) {
  if (!isFirebaseConfigured) return demoUpdate('users', uid, { nivelAtual: newLevel });
  await updateDoc(doc(db, 'users', uid), { nivelAtual: newLevel });
}

/** Escuta o perfil em tempo real — usado para exibir o Nível ao vivo. */
export function observarPerfil(uid, callback) {
  if (!isFirebaseConfigured) return demoObservarDoc('users', uid, callback);
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => callback(snap.exists() ? snap.data() : null),
    (err) => {
      // Negação transitória durante a inicialização do token de auth —
      // não é fatal; o snapshot é reavaliado quando a auth fica pronta.
      if (err?.code !== 'permission-denied') {
        // eslint-disable-next-line no-console
        console.warn('[perfil] erro no snapshot:', err?.code || err);
      }
    },
  );
}

// =====================================================================
// COLEÇÃO: tracks
// =====================================================================
export async function getTrack(trackId) {
  if (!isFirebaseConfigured) return demoGet('tracks', trackId) || TRACKS_SEED.find((t) => t.id === trackId) || null;
  const snap = await getDoc(doc(db, 'tracks', trackId));
  return snap.exists() ? snap.data() : null;
}

/** Popula a coleção `tracks` com o seed (executar uma vez / migração). */
export async function seedTracks() {
  if (!isFirebaseConfigured) {
    TRACKS_SEED.forEach((t) => demoSet('tracks', t.id, t));
    return TRACKS_SEED.length;
  }
  const batch = writeBatch(db);
  TRACKS_SEED.forEach((t) => batch.set(doc(db, 'tracks', t.id), t, { merge: true }));
  await batch.commit();
  return TRACKS_SEED.length;
}

// =====================================================================
// COLEÇÃO: user_progress
// =====================================================================
export async function setModuleProgress({ userId, trackId, moduleId, completed }) {
  const id = `${userId}_${trackId}_${moduleId}`;
  const registro = {
    userId,
    trackId,
    moduleId,
    completed: Boolean(completed),
    completedAt: completed ? (isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()) : null,
  };
  if (!isFirebaseConfigured) return demoSet('user_progress', id, registro);
  await setDoc(doc(db, 'user_progress', id), registro, { merge: true });
  return registro;
}

export async function getUserProgress(userId) {
  if (!isFirebaseConfigured) {
    return demoAll('user_progress').filter((p) => p.userId === userId);
  }
  const q = query(collection(db, 'user_progress'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

/** Todo o progresso (admin/gestor) — para calcular o % de cada colaborador. */
export async function listarProgresso() {
  if (!isFirebaseConfigured) return demoAll('user_progress');
  const snap = await getDocs(collection(db, 'user_progress'));
  return snap.docs.map((d) => d.data());
}

// =====================================================================
// COLEÇÃO: mentorships — automação Nível 2 / Nível 3
// =====================================================================
/**
 * Vincula um Mentor (N2) a um Afilhado (N1) da MESMA trilha.
 * Cria o documento de mentoria com status ACTIVE.
 */
export async function assignMentorship(mentorUid, menteeUid, trackId) {
  const id = `${mentorUid}__${menteeUid}`;
  const registro = { id, mentorId: mentorUid, menteeId: menteeUid, trackId, status: 'ACTIVE' };
  if (!isFirebaseConfigured) {
    demoSet('mentorships', id, registro);
    return registro;
  }
  await setDoc(doc(db, 'mentorships', id), registro, { merge: true });
  return registro;
}

/**
 * Gatilho de graduação: chamado quando o afilhado passa na certificação N1.
 *   1. Afilhado sobe para o Nível 2.
 *   2. Encerra a mentoria (status COMPLETED).
 *   3. Busca o mentor e o promove automaticamente para o Nível 3.
 * Retorna um resumo dos eventos aplicados.
 */
export async function checkMenteeGraduation(menteeUid) {
  const eventos = [];

  // 1. Afilhado -> Nível 2
  await updateUserLevel(menteeUid, 2);
  eventos.push({ tipo: 'MENTEE_PROMOTED', uid: menteeUid, nivel: 2 });

  // 2. Localiza a mentoria ativa do afilhado
  const mentoria = await findActiveMentorshipByMentee(menteeUid);
  if (!mentoria) return { ok: true, eventos, aviso: 'Sem mentoria ativa para este afilhado.' };

  // Encerra a mentoria
  if (!isFirebaseConfigured) {
    demoUpdate('mentorships', mentoria.id, { status: 'COMPLETED' });
  } else {
    await updateDoc(doc(db, 'mentorships', mentoria.id), { status: 'COMPLETED' });
  }
  eventos.push({ tipo: 'MENTORSHIP_COMPLETED', id: mentoria.id });

  // 3. Promove o mentor -> Nível 3
  await updateUserLevel(mentoria.mentorId, 3);
  eventos.push({ tipo: 'MENTOR_PROMOTED', uid: mentoria.mentorId, nivel: 3 });

  return { ok: true, eventos };
}

async function findActiveMentorshipByMentee(menteeUid) {
  if (!isFirebaseConfigured) {
    return demoAll('mentorships').find(
      (m) => m.menteeId === menteeUid && m.status === 'ACTIVE',
    );
  }
  const q = query(
    collection(db, 'mentorships'),
    where('menteeId', '==', menteeUid),
    where('status', '==', 'ACTIVE'),
  );
  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0].data();
}

// =====================================================================
// ADMIN — CRUD de trilhas, colaboradores e mentorias (painel do app)
// =====================================================================

// --- Trilhas ---
export async function listarTrilhas() {
  if (!isFirebaseConfigured) {
    const locais = demoAll('tracks');
    return locais.length ? locais : TRACKS_SEED;
  }
  const snap = await getDocs(collection(db, 'tracks'));
  return snap.docs.map((d) => d.data());
}

export async function salvarTrilha(trilha) {
  const id = trilha.id;
  const dados = { ...trilha, modulos: trilha.modulos || [] };
  if (!isFirebaseConfigured) return demoSet('tracks', id, dados);
  await setDoc(doc(db, 'tracks', id), dados, { merge: true });
  return dados;
}

export async function excluirTrilha(id) {
  if (!isFirebaseConfigured) return demoDelete('tracks', id);
  await deleteDoc(doc(db, 'tracks', id));
}

// --- Colaboradores (users) ---
export async function listarUsuarios() {
  if (!isFirebaseConfigured) return demoAll('users');
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => d.data());
}

/** Admin atualiza nível/trilha de um colaborador. */
export async function atualizarUsuario(uid, dados) {
  if (!isFirebaseConfigured) return demoUpdate('users', uid, dados);
  await updateDoc(doc(db, 'users', uid), dados);
}

// --- Mentorias ---
export async function listarMentorias() {
  if (!isFirebaseConfigured) return demoAll('mentorships');
  const snap = await getDocs(collection(db, 'mentorships'));
  return snap.docs.map((d) => d.data());
}

export async function salvarMentoria({ mentorId, menteeId, trackId, status = 'ACTIVE' }) {
  const id = `${mentorId}__${menteeId}`;
  const registro = { id, mentorId, menteeId, trackId, status };
  if (!isFirebaseConfigured) {
    demoSet('mentorships', id, registro);
    return registro;
  }
  await setDoc(doc(db, 'mentorships', id), registro, { merge: true });
  return registro;
}

export async function excluirMentoria(id) {
  if (!isFirebaseConfigured) return demoDelete('mentorships', id);
  await deleteDoc(doc(db, 'mentorships', id));
}

// =====================================================================
// AUTOMAÇÃO DE MENTORIA (roda no cliente do próprio usuário)
// =====================================================================

/**
 * Ao virar N2, vincula automaticamente 1 afilhado disponível:
 * um aluno N1 da MESMA trilha, sem mentor ativo. Retorna a mentoria ou null.
 */
export async function autoVincularAfilhado(mentorUid, trilhaId) {
  const [usuarios, mentorias] = await Promise.all([listarUsuarios(), listarMentorias()]);
  const jaMentor = mentorias.some((m) => m.mentorId === mentorUid && m.status === 'ACTIVE');
  if (jaMentor) return null;
  const ocupados = new Set(
    mentorias.filter((m) => m.status === 'ACTIVE').map((m) => m.menteeId),
  );
  const afilhado = usuarios.find(
    (u) =>
      (u.nivelAtual ?? 0) === 1 &&
      u.trilhaAtivaId === trilhaId &&
      u.uid !== mentorUid &&
      !ocupados.has(u.uid),
  );
  if (!afilhado) return null;
  return salvarMentoria({ mentorId: mentorUid, menteeId: afilhado.uid, trackId: trilhaId });
}

/**
 * Reconciliação (roda quando o MENTOR abre o app): se o afilhado já se
 * certificou (subiu para N2+), encerra a mentoria e promove o mentor a N3.
 * Retorna true se promoveu.
 */
export async function reconciliarPromocaoMentor(uid, nivelAtual) {
  if (nivelAtual !== 2) return false;
  const mentorias = await listarMentorias();
  const minha = mentorias.find((m) => m.mentorId === uid && m.status === 'ACTIVE');
  if (!minha) return false;
  const mentee = await getUserProfile(minha.menteeId);
  if (mentee && (mentee.nivelAtual ?? 0) >= 2) {
    await salvarMentoria({ ...minha, status: 'COMPLETED' });
    await updateUserLevel(uid, 3);
    return true;
  }
  return false;
}

// =====================================================================
// STORE LOCAL (MODO DEMO) — espelha o Firestore em localStorage
// =====================================================================
const DEMO_DB_KEY = 'ft.demoDb';
const demoDocListeners = new Map(); // `col/id` -> Set<cb>

function demoLoad() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_DB_KEY)) || {};
  } catch {
    return {};
  }
}
function demoPersist(dbObj) {
  try {
    localStorage.setItem(DEMO_DB_KEY, JSON.stringify(dbObj));
  } catch {
    /* noop */
  }
}
function demoSet(col, id, data) {
  const store = demoLoad();
  store[col] = store[col] || {};
  store[col][id] = { ...(store[col][id] || {}), ...data };
  demoPersist(store);
  notify(col, id, store[col][id]);
  return store[col][id];
}
function demoUpdate(col, id, patch) {
  return demoSet(col, id, patch);
}
function demoDelete(col, id) {
  const store = demoLoad();
  if (store[col]) {
    delete store[col][id];
    demoPersist(store);
    notify(col, id, null);
  }
}
function demoGet(col, id) {
  const store = demoLoad();
  return store[col]?.[id] || null;
}
function demoAll(col) {
  const store = demoLoad();
  return Object.values(store[col] || {});
}
function demoObservarDoc(col, id, callback) {
  const key = `${col}/${id}`;
  if (!demoDocListeners.has(key)) demoDocListeners.set(key, new Set());
  demoDocListeners.get(key).add(callback);
  callback(demoGet(col, id)); // estado atual imediato
  return () => demoDocListeners.get(key)?.delete(callback);
}
function notify(col, id, data) {
  demoDocListeners.get(`${col}/${id}`)?.forEach((cb) => cb(data));
}
