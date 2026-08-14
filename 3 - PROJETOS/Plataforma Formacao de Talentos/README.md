# FORMAÇÃO DE TALENTOS

Protótipo de plataforma que automatiza a jornada de **aprendizado → nivelamento → apadrinhamento (peer-mentoring)** de colaboradores de fábrica, levando pessoas sem base em tecnologia até o nível de especialistas de suporte.

Stack: **React + Vite + Tailwind CSS + Lucide Icons + Firebase (Auth + Firestore)**. Identidade visual **Zello** (Laranja & Preto), alto contraste para celulares/tablets no chão de fábrica.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Use o **Simulador de visão** no topo para alternar entre os perfis.

### Firebase (opcional)

Sem credenciais, o app roda em **MODO DEMO** (Auth e Firestore simulados via `localStorage`) — funciona de imediato. Para ativar o Firebase real, copie `.env.example` para `.env.local` e preencha as chaves `VITE_FIREBASE_*`. As regras de segurança estão em [`firestore.rules`](firestore.rules).

## Estrutura de arquivos

```
.
├── tailwind.config.js              # Paleta Zello (namespace `zello` + tokens semânticos)
├── firestore.rules                 # Regras de segurança (só e-mails @zello.tec.br)
├── .env.example                    # Modelo de config do Firebase
├── database/
│   └── schema.sql                  # Schema PostgreSQL/Supabase (alternativa ao Firestore)
├── public/assets/
│   └── zello-logo.svg              # Símbolo da Zello (uso opcional via <img>)
├── src/
│   ├── firebase.js                 # Inicialização (app, auth, db) + flag de config
│   ├── services/
│   │   ├── authService.js          # Auth + validação estrita @zello.tec.br
│   │   └── dbService.js            # users, tracks, user_progress, mentorships + automação N2→N3
│   ├── components/
│   │   ├── ZelloLogo.jsx           # Símbolo "Z" estilizado (SVG)
│   │   ├── Navbar.jsx              # Header com marca Zello + Nível ao vivo
│   │   └── Login.jsx               # Tela de login/cadastro conectada ao Firebase
│   ├── lib/
│   │   └── mentoriaAutomation.ts   # Regras puras de match/promoção (referência)
│   ├── data/
│   │   └── mock.js                 # Dados simulados das 5 visões
│   ├── FormacaoDeTalentosApp.jsx   # App principal + 5 visões
│   ├── main.jsx
│   └── index.css
└── index.html
```

## Regras de negócio (níveis encadeados)

| Nível | Papel | Regra de transição (automática) |
|-------|-------|----------------------------------|
| **N0** | Introdução Básica | Obrigatório a todos. 10 trilhas técnicas ficam bloqueadas (cadeado). |
| **N1** | Trilha Técnica | Escolhe 1 das 10 trilhas. Estuda módulos + passa na **Certificação N1**. |
| **N2** | Squad + Mentoria | Ao certificar N1, entra no Squad e o sistema vincula **automaticamente** 1 aluno N1 da **mesma trilha** como afilhado. |
| **N3** | Formado / Suporte | Quando o afilhado é certificado (sobe a N2), o mentor é promovido **automaticamente** a N3 (Especialista de Suporte). |

A lógica de match e promoção em cascata está em [`src/lib/mentoriaAutomation.ts`](src/lib/mentoriaAutomation.ts) — funções puras, prontas para virar uma Edge Function do Supabase.

## Paleta Zello (Laranja & Preto)

| Token | `zello.*` | Hex | Uso |
|-------|-----------|-----|-----|
| `deep` | `zello.dark` | `#0B0F19` | Fundo principal |
| `elevated` | `zello.card` | `#161B28` | Cards/modais |
| `line` | `zello.border` | `#27272A` | Bordas/divisores |
| `primary` | `zello.orange` | `#FF6B00` | Ações / CTA (Laranja Zello) |
| `accent` | `zello.amber` | `#F59E0B` | Progresso / destaques |
| `ice` | `zello.text` | `#FFFFFF` | Texto principal |
| `silver` | `zello.muted` | `#A1A1AA` | Texto secundário |
