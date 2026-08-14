// Inicialização compartilhada do Firebase Admin SDK.
// Usa a chave de serviço em serviceAccountKey.json (gitignored).
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';

const serviceAccount = JSON.parse(
  readFileSync(new URL('../serviceAccountKey.json', import.meta.url), 'utf8'),
);

const app = initializeApp({ credential: cert(serviceAccount) });

export const auth = getAuth(app);
export const db = getFirestore(app);
export const projetoId = serviceAccount.project_id;
