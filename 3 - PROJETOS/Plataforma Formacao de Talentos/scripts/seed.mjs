// =====================================================================
// seed.mjs — Popula o Firebase com dados iniciais:
//   1. Trilhas (coleção `tracks`) — de scripts/data/trilhas.js
//   2. Colaboradores (Authentication + coleção `users`) já no nível certo
//   3. Mentorias ativas (coleção `mentorships`)
//
// Uso:  node scripts/seed.mjs
//       node scripts/seed.mjs --tracks   (só trilhas)
//       node scripts/seed.mjs --users    (só colaboradores + mentorias)
// É idempotente: rodar de novo atualiza o que já existe.
// =====================================================================
import { FieldValue } from 'firebase-admin/firestore';
import { auth, db, projetoId } from './_admin.mjs';
import { TRILHAS } from './data/trilhas.js';
import { COLABORADORES, MENTORIAS } from './data/colaboradores.js';

const DOMINIO = '@zello.tec.br';

// ---------------------------------------------------------------------
// 1. TRILHAS
// ---------------------------------------------------------------------
async function seedTrilhas() {
  console.log('\n📚 Trilhas...');
  for (const t of TRILHAS) {
    await db.collection('tracks').doc(t.id).set(
      {
        id: t.id,
        nome: t.nome,
        nivel: t.nivel,
        ordem: t.ordem,
        icone: t.icone,
        descricao: t.descricao,
        modulos: t.modulos || [],
        atualizadoEm: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    console.log(`   • ${t.id} (${(t.modulos || []).length} módulos)`);
  }
}

// ---------------------------------------------------------------------
// 2. COLABORADORES (Auth + users)
// ---------------------------------------------------------------------
async function getOrCreateUser({ nome, email, senhaTemporaria }) {
  try {
    return await auth.getUserByEmail(email);
  } catch {
    return auth.createUser({
      email,
      password: senhaTemporaria,
      displayName: nome,
      emailVerified: false,
    });
  }
}

async function seedColaboradores() {
  console.log('\n👥 Colaboradores...');
  const emailParaUid = {};

  for (const c of COLABORADORES) {
    if (!c.email.toLowerCase().endsWith(DOMINIO)) {
      console.log(`   ⚠️  Ignorado (e-mail não corporativo): ${c.email}`);
      continue;
    }
    const user = await getOrCreateUser(c);
    emailParaUid[c.email.toLowerCase()] = user.uid;

    await db.collection('users').doc(user.uid).set(
      {
        uid: user.uid,
        nome: c.nome,
        email: c.email.toLowerCase(),
        nivelAtual: c.nivel,
        trilhaAtivaId: c.trilha,
        criadoEm: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    console.log(`   • ${c.nome} — Nível ${c.nivel} (${c.trilha})`);
  }
  return emailParaUid;
}

// ---------------------------------------------------------------------
// 3. MENTORIAS
// ---------------------------------------------------------------------
async function seedMentorias(emailParaUid) {
  if (!MENTORIAS.length) return;
  console.log('\n🤝 Mentorias...');
  for (const m of MENTORIAS) {
    const mentorId = emailParaUid[m.mentorEmail.toLowerCase()];
    const menteeId = emailParaUid[m.afilhadoEmail.toLowerCase()];
    if (!mentorId || !menteeId) {
      console.log(`   ⚠️  Pulada (colaborador não encontrado): ${m.mentorEmail} → ${m.afilhadoEmail}`);
      continue;
    }
    const id = `${mentorId}__${menteeId}`;
    await db.collection('mentorships').doc(id).set(
      {
        id,
        mentorId,
        menteeId,
        trackId: m.trilha,
        status: 'ACTIVE',
        criadoEm: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    console.log(`   • ${m.mentorEmail} → ${m.afilhadoEmail} (${m.trilha})`);
  }
}

// ---------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const soTracks = args.includes('--tracks');
  const soUsers = args.includes('--users');
  const tudo = !soTracks && !soUsers;

  console.log(`\n🌱 Seed no projeto "${projetoId}"`);

  if (tudo || soTracks) await seedTrilhas();
  if (tudo || soUsers) {
    const mapa = await seedColaboradores();
    await seedMentorias(mapa);
  }

  console.log('\n✅ Seed concluído.\n');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Erro no seed:', e);
  process.exit(1);
});
