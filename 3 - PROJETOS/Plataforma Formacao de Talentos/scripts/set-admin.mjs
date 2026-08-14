// =====================================================================
// set-admin.mjs — concede (ou remove) permissão de ADMIN a um usuário.
// Admin pode gerenciar trilhas, colaboradores e mentorias pelo app.
//
// Uso:
//   node scripts/set-admin.mjs email@zello.tec.br            (concede)
//   node scripts/set-admin.mjs email@zello.tec.br --remove   (remove)
//
// Depois, o usuário precisa SAIR e ENTRAR de novo (renova o token).
// =====================================================================
import { auth, db } from './_admin.mjs';

const email = process.argv[2];
const remover = process.argv.includes('--remove');

if (!email) {
  console.log('Uso: node scripts/set-admin.mjs email@zello.tec.br [--remove]');
  process.exit(1);
}

const user = await auth.getUserByEmail(email).catch(() => null);
if (!user) {
  console.error(`❌ Usuário não encontrado: ${email}. Crie a conta no app primeiro.`);
  process.exit(1);
}

await auth.setCustomUserClaims(user.uid, remover ? { admin: false } : { admin: true });
await db.collection('users').doc(user.uid).set({ admin: !remover }, { merge: true });

console.log(
  `✅ ${email} ${remover ? 'não é mais admin' : 'agora é ADMIN'}.\n` +
    '   Peça para SAIR e ENTRAR de novo no app para renovar o token.',
);
process.exit(0);
