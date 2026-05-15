# EcoFlow Logistics

Aplicacao web para gestao de residuos, logistica reversa e metricas ESG.

O projeto usa Vite, React, TypeScript, Tailwind CSS, shadcn/ui, Express, Prisma e PostgreSQL no Railway. O frontend consome a API propria por `VITE_API_URL`; nao acessa o banco diretamente.

## Requisitos

- Node.js 18+
- npm

Use npm como gerenciador de pacotes. Nao misture npm, yarn, pnpm ou bun neste projeto.

## Instalacao

```bash
npm install
```

## Variaveis de ambiente

Crie um arquivo `.env` local a partir do modelo:

```bash
cp .env.example .env
```

Variavel publica do frontend:

- `VITE_API_URL`

Variaveis privadas de servidor:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AUTH_COOKIE_NAME`
- `CORS_ORIGIN`

Variaveis privadas nao devem ser acessadas pelo Vite/React. Nunca coloque `DATABASE_URL`, senhas ou tokens secretos no frontend. Nao crie `VITE_DATABASE_URL`.

## Desenvolvimento

Para rodar a API local:

```bash
npm run server:dev
```

A API usa `http://localhost:3001` por padrao e expoe:

- `GET /api/health`
- `GET /api/health/db`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Para rodar o frontend:

```bash
npm run dev
```

A aplicacao roda por padrao em `http://localhost:8080`.

## Autenticacao

A autenticacao usa a API propria com JWT em cookie httpOnly. O frontend nao armazena token manualmente e as chamadas para a API usam `credentials: "include"`.

Endpoints de dados protegidos exigem `requireAuth`; rotas administrativas, como `/api/users`, tambem exigem `requireRole(["admin"])`.

## Banco de dados

O banco atual e PostgreSQL no Railway, acessado pelo backend com Prisma. Beekeeper Studio pode ser usado apenas como cliente visual para consultar o banco; ele nao hospeda os dados.

Prisma:

- schema: `prisma/schema.prisma`
- client server-side: `src/server/db/prisma.ts`

Comandos disponiveis:

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
```

## Build

```bash
npm run build
```

## Testes e qualidade

```bash
npm run lint
npm run test
```

## Seguranca

- Nunca versione `.env`.
- Use `.env.example` somente como modelo.
- Credenciais que ja foram expostas devem ser rotacionadas.
- Como o `.env` ja entrou no historico Git, avalie uma limpeza planejada do historico antes de tornar o repositorio publico ou compartilhar novamente.
- Configure `CORS_ORIGIN` com a origem explicita do frontend; nao use `"*"`.
