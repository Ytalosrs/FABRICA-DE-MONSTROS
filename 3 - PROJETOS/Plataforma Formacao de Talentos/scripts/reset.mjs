// =====================================================================
// reset.mjs — APAGA TODOS OS DADOS do projeto (destrutivo!)
//   • Coleções: users, tracks, user_progress, mentorships
//   • Todos os usuários do Authentication
//
// Uso:  node scripts/reset.mjs --confirm
// (sem --confirm ele só avisa e não apaga nada)
// =====================================================================
import { auth, db, projetoId } from './_admin.mjs';

const COLECOES = ['users', 'tracks', 'user_progress', 'mentorships'];

async function apagarColecao(nome) {
  const snap = await db.collection(nome).get();
  if (snap.empty) return 0;
  // Firestore permite no máx. 500 operações por batch.
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += 400) {
    const batch = db.batch();
    docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  return docs.length;
}

async function apagarUsuariosAuth() {
  let total = 0;
  let pageToken;
  do {
    const res = await auth.listUsers(1000, pageToken);
    if (res.users.length) {
      await auth.deleteUsers(res.users.map((u) => u.uid));
      total += res.users.length;
    }
    pageToken = res.pageToken;
  } while (pageToken);
  return total;
}

async function main() {
  if (!process.argv.includes('--confirm')) {
    console.log('\n⚠️  ATENÇÃO: isso APAGA todos os dados e TODOS os usuários do projeto:');
    console.log(`    Projeto: ${projetoId}`);
    console.log(`    Coleções: ${COLECOES.join(', ')} + Authentication\n`);
    console.log('   Para prosseguir de verdade, rode:');
    console.log('     node scripts/reset.mjs --confirm\n');
    process.exit(0);
  }

  console.log(`\n🧹 Zerando o projeto "${projetoId}"...`);
  for (const c of COLECOES) {
    const n = await apagarColecao(c);
    console.log(`   • ${c}: ${n} documento(s) apagado(s)`);
  }
  const nUsers = await apagarUsuariosAuth();
  console.log(`   • Authentication: ${nUsers} usuário(s) apagado(s)`);
  console.log('\n✅ Projeto zerado.\n');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Erro no reset:', e);
  process.exit(1);
});
