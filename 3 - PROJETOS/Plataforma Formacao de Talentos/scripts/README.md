# Scripts de administração (Firebase Admin)

Ferramentas para **zerar** e **popular** o Firebase do projeto `formacao-de-talentos`.
Usam a chave `serviceAccountKey.json` (na raiz, protegida pelo `.gitignore`).

## Arquivos de dados (edite estes)
- `scripts/data/trilhas.js` — trilhas, módulos e conteúdos.
- `scripts/data/colaboradores.js` — pessoas (nível/trilha) e mentorias.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run db:reset` | **Só avisa** (não apaga) — mostra o que seria apagado |
| `npm run db:reset -- --confirm` | ⚠️ **APAGA TUDO**: coleções + usuários do Auth |
| `npm run db:seed` | Popula trilhas + colaboradores + mentorias |
| `npm run db:seed:tracks` | Popula **só** as trilhas |
| `npm run db:seed:users` | Popula **só** colaboradores + mentorias |

## Fluxo recomendado
```bash
# 1. Zerar tudo (cuidado!)
npm run db:reset -- --confirm

# 2. Popular com os dados dos arquivos data/
npm run db:seed
```

## Adicionar uma nova trilha ou conteúdo
1. Edite `scripts/data/trilhas.js` (copie um bloco, troque o `id`, preencha os módulos).
2. Rode `npm run db:seed:tracks`. Pronto — a nova trilha entra no banco.

## Adicionar/atualizar colaboradores
1. Edite `scripts/data/colaboradores.js`.
2. Rode `npm run db:seed:users`. Cria as contas que faltam e ajusta o nível de cada um.

> As senhas em `colaboradores.js` são **temporárias** — peça para trocarem no 1º acesso.
