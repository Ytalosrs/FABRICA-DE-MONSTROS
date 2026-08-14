// =====================================================================
// firebase.js — Inicialização centralizada do Firebase
// Exporta: app, auth (getAuth) e db (getFirestore).
//
// As credenciais vêm de variáveis de ambiente do Vite (prefixo VITE_).
// Crie um arquivo .env.local (veja .env.example) com os valores do seu
// projeto Firebase. Enquanto não houver config, `isFirebaseConfigured`
// fica false e a camada de serviço usa um fallback local (modo demo),
// mantendo o protótipo executável sem quebrar.
// =====================================================================
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Só há config válida quando as chaves essenciais estão presentes.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // eslint-disable-next-line no-console
  console.warn(
    '[Firebase] Configuração ausente — rodando em MODO DEMO (auth/DB simulados). ' +
      'Defina as variáveis VITE_FIREBASE_* em .env.local para ativar o Firebase real.',
  );
}

export { app, auth, db, storage, firebaseConfig };
