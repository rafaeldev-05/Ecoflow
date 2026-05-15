# Migracao Supabase para Railway + Prisma

## Situacao atual

A migracao principal foi concluida. O fluxo real do app usa:

- PostgreSQL no Railway.
- Prisma no backend/API.
- Express para endpoints proprios.
- Auth propria com JWT em cookie httpOnly.
- Frontend consumindo a API por `VITE_API_URL`.

Supabase foi removido do fluxo real do app. As variaveis antigas de Supabase e o client frontend legado nao sao mais necessarios.

## Auth propria

Endpoints:

- `POST /api/auth/login`: valida email/senha e cria o cookie httpOnly.
- `GET /api/auth/me`: exige cookie valido e retorna o usuario autenticado.
- `POST /api/auth/logout`: limpa o cookie.

O token nao e salvo em `localStorage` e nao e exposto ao frontend.

## Dados

As principais funcionalidades foram migradas para endpoints Express + Prisma:

- materials
- collections
- environmental_metrics
- dashboard
- users
- auth

Endpoints de dados usam `requireAuth`. Rotas administrativas, como `/api/users`, usam `requireAuth` e `requireRole(["admin"])`.

## Railway e Beekeeper Studio

Railway hospeda o banco PostgreSQL. Beekeeper Studio e apenas um cliente visual para conectar, visualizar e administrar o banco. O banco nao fica no Beekeeper.

## Deploy

Para producao, configure:

- Frontend na Vercel.
- API no Railway.
- PostgreSQL no Railway.
- `VITE_API_URL` apontando para a API.
- `DATABASE_URL` somente no backend.
- `JWT_SECRET` forte e privado.
- `CORS_ORIGIN` com a origem explicita do frontend.
- Cookies seguros em producao.
