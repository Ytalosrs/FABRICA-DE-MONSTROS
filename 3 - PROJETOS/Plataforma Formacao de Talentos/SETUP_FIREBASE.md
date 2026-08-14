# Ativar o Firebase — passo a passo

O código já está pronto. Falta só criar o projeto no Firebase e colar as chaves.

## 1. Criar o projeto
1. Acesse https://console.firebase.google.com e clique em **Adicionar projeto**.
2. Nome sugerido: `formacao-talentos-zello`. Pode desativar o Google Analytics.

## 2. Registrar o app Web
1. No painel do projeto, clique no ícone **`</>`** (Web).
2. Apelido: `formacao-talentos`. **Não** marque "Firebase Hosting" por enquanto.
3. O Firebase mostrará um objeto `firebaseConfig` com as chaves — deixe aberto.

## 3. Colar as chaves no `.env.local`
Copie cada valor do `firebaseConfig` para o arquivo `.env.local`:

| firebaseConfig | .env.local |
|---|---|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

## 4. Ativar Authentication
1. Menu lateral > **Authentication** > **Vamos começar**.
2. Aba **Sign-in method** > ative **E-mail/senha** > Salvar.

## 5. Criar o Firestore
1. Menu lateral > **Firestore Database** > **Criar banco de dados**.
2. Comece em **modo de produção** (as regras deste projeto cuidam da segurança).
3. Escolha a região (ex.: `southamerica-east1` — São Paulo).

## 6. Publicar as regras de segurança
No terminal, dentro da pasta do projeto:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

## 7. Reiniciar o app
```bash
npm run dev
```
O app detecta o `.env.local` preenchido e **sai do modo demo** automaticamente.
Crie sua conta na tela de login com um e-mail `@zello.tec.br`.

## 8. (Opcional) Popular as trilhas
As 11 trilhas podem ser gravadas na coleção `tracks` chamando `seedTracks()`
(função já pronta em `src/services/dbService.js`).
