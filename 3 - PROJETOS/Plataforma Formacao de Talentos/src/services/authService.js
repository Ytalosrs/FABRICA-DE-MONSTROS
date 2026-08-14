// =====================================================================
// authService.js — Autenticação (Firebase Auth) com validação de domínio
// Regra: e-mail DEVE terminar com @zello.tec.br.
// Em MODO DEMO (Firebase não configurado) simula o fluxo localmente,
// mantendo o protótipo executável.
// =====================================================================
import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, firebaseConfig } from '../firebase.js';
import { criarPerfilUsuario, getUserProfile } from './dbService.js';

export const DOMINIO_CORPORATIVO = '@zello.tec.br';
export const MSG_DOMINIO = 'Cadastro permitido exclusivamente para e-mails @zello.tec.br';

/** Valida formato + sufixo corporativo estrito. */
export function validarEmailCorporativo(email) {
  const valor = String(email).trim().toLowerCase();
  const formatoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  return formatoOk && valor.endsWith(DOMINIO_CORPORATIVO);
}

// Traduz códigos de erro do Firebase para mensagens amigáveis (pt-BR).
function traduzErro(code) {
  const mapa = {
    'auth/email-already-in-use': 'Este e-mail já possui cadastro.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'Credenciais inválidas.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  };
  return mapa[code] || 'Não foi possível concluir a operação. Tente novamente.';
}

// ---------------------------------------------------------------------
// REGISTRO
// ---------------------------------------------------------------------
export async function registrar({ nome, email, senha }) {
  if (!validarEmailCorporativo(email)) throw new Error(MSG_DOMINIO);
  const emailN = email.trim().toLowerCase();

  if (!isFirebaseConfigured) {
    return demoRegistrar({ nome, email: emailN });
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, emailN, senha);
    if (nome) await updateProfile(cred.user, { displayName: nome });
    // Cria automaticamente o documento em `users` com valores padrão.
    await criarPerfilUsuario({
      uid: cred.user.uid,
      nome: nome || emailN.split('@')[0],
      email: emailN,
    });
    return cred.user;
  } catch (e) {
    throw new Error(e?.message?.includes(DOMINIO_CORPORATIVO) ? e.message : traduzErro(e.code));
  }
}

// ---------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------
export async function entrar({ email, senha }) {
  if (!validarEmailCorporativo(email)) throw new Error(MSG_DOMINIO);
  const emailN = email.trim().toLowerCase();

  if (!isFirebaseConfigured) {
    return demoEntrar({ email: emailN });
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, emailN, senha);
    return cred.user;
  } catch (e) {
    throw new Error(traduzErro(e.code));
  }
}

// ---------------------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------------------
export async function sair() {
  if (!isFirebaseConfigured) return demoSair();
  await signOut(auth);
}

// ---------------------------------------------------------------------
// OBSERVADOR DE SESSÃO — retorna função de cancelamento (unsubscribe)
// ---------------------------------------------------------------------
export function observarAuth(callback) {
  if (!isFirebaseConfigured) return demoObservar(callback);
  return onAuthStateChanged(auth, callback);
}

// ---------------------------------------------------------------------
// ADMIN — criar colaborador e checar permissão
// ---------------------------------------------------------------------

let _secSeq = 0;

/**
 * Cria um colaborador (Auth + doc `users`) SEM derrubar a sessão do admin.
 * No Firebase real usa um app secundário; no demo, grava localmente.
 */
export async function criarColaborador({ nome, email, senha, nivelAtual = 0, trilhaAtivaId }) {
  const emailN = String(email).trim().toLowerCase();
  if (!validarEmailCorporativo(emailN)) throw new Error(MSG_DOMINIO);
  if (senha && senha.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');

  if (!isFirebaseConfigured) {
    const uid = `demo_${emailN.replace(/[^a-z0-9]/gi, '').slice(0, 16)}`;
    await criarPerfilUsuario({ uid, nome, email: emailN, nivelAtual, trilhaAtivaId });
    return { uid, email: emailN };
  }

  const secApp = initializeApp(firebaseConfig, `sec-admin-${_secSeq++}`);
  const secAuth = getAuth(secApp);
  try {
    const cred = await createUserWithEmailAndPassword(secAuth, emailN, senha);
    if (nome) await updateProfile(cred.user, { displayName: nome });
    // O doc é gravado pela sessão do ADMIN (primary), autorizado pelas regras.
    await criarPerfilUsuario({ uid: cred.user.uid, nome, email: emailN, nivelAtual, trilhaAtivaId });
    await signOut(secAuth);
    return { uid: cred.user.uid, email: emailN };
  } catch (e) {
    throw new Error(e?.message?.includes(DOMINIO_CORPORATIVO) ? e.message : traduzErro(e.code));
  } finally {
    await deleteApp(secApp);
  }
}

/** Retorna true se o usuário logado é admin (claim no token). No demo, sempre true. */
export async function checarAdmin() {
  if (!isFirebaseConfigured) return true;
  const u = auth.currentUser;
  if (!u) return false;
  try {
    const res = await u.getIdTokenResult(true);
    return res.claims.admin === true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------
// ACESSO RÁPIDO DE TESTE / DEMONSTRAÇÃO (apenas desenvolvimento)
// Entra direto com um perfil de teste, ignorando o Firebase Auth.
// ---------------------------------------------------------------------
export async function loginDemo({ nome, email, nivelAtual = 0, trilhaAtivaId }) {
  const emailN = String(email).trim().toLowerCase();
  const uid = `demo_${emailN.replace(/[^a-z0-9]/gi, '').slice(0, 16)}`;
  await criarPerfilUsuario({ uid, nome, email: emailN, nivelAtual, trilhaAtivaId });
  const user = { uid, email: emailN, displayName: nome };
  demoSalvar(user);
  return user;
}

// =====================================================================
// MODO DEMO (sem Firebase) — simulação local via localStorage
// =====================================================================
const DEMO_KEY = 'ft.demoUser';
const demoListeners = new Set();

function demoLer() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function demoSalvar(u) {
  try {
    if (u) localStorage.setItem(DEMO_KEY, JSON.stringify(u));
    else localStorage.removeItem(DEMO_KEY);
  } catch {
    /* noop */
  }
  demoListeners.forEach((cb) => cb(u));
}
async function demoRegistrar({ nome, email }) {
  const uid = `demo_${email.replace(/[^a-z0-9]/gi, '').slice(0, 12)}`;
  const user = { uid, email, displayName: nome || email.split('@')[0] };
  await criarPerfilUsuario({ uid, nome: user.displayName, email });
  demoSalvar(user);
  return user;
}
async function demoEntrar({ email }) {
  const uid = `demo_${email.replace(/[^a-z0-9]/gi, '').slice(0, 12)}`;
  // Garante um perfil mesmo se o usuário "logar" sem ter se cadastrado no demo.
  const existente = await getUserProfile(uid);
  if (!existente) await criarPerfilUsuario({ uid, nome: email.split('@')[0], email });
  const user = { uid, email, displayName: existente?.nome || email.split('@')[0] };
  demoSalvar(user);
  return user;
}
function demoSair() {
  demoSalvar(null);
}
function demoObservar(callback) {
  demoListeners.add(callback);
  // Dispara o estado atual imediatamente (comportamento do onAuthStateChanged).
  callback(demoLer());
  return () => demoListeners.delete(callback);
}
