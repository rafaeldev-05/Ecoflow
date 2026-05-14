# EcoFlow Logistics

Aplicacao web para gestao de residuos, logistica reversa e metricas ESG.

O projeto atualmente usa Vite, React, TypeScript, Tailwind CSS, shadcn/ui e Supabase. Uma base inicial de Prisma foi adicionada apenas para preparar uma futura migracao para PostgreSQL no Railway.

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

Variaveis publicas do frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Variaveis privadas de servidor:

- `DATABASE_URL`
- `JWT_SECRET`

Variaveis privadas nao devem ser acessadas pelo Vite/React. Nunca coloque `SUPABASE_SERVICE_ROLE_KEY`, connection strings privadas, senhas ou tokens secretos no frontend.

## Desenvolvimento

```bash
npm run dev
```

A aplicacao roda por padrao em `http://localhost:8080`.

## Build

```bash
npm run build
```

## Testes e qualidade

```bash
npm run lint
npm run test
```

## Prisma

Prisma foi preparado para uso futuro no backend/API:

- schema: `prisma/schema.prisma`
- client server-side: `src/server/db/prisma.ts`

Comandos disponiveis:

```bash
npm run prisma:validate
npm run prisma:generate
```

O app ainda nao usa Prisma em producao. O frontend continua usando Supabase temporariamente.

## Banco de dados

Estado atual:

- Supabase ainda e usado como banco/API/Auth.
- As migrations atuais ficam em `supabase/migrations`.

Estado futuro planejado:

- PostgreSQL no Railway.
- Prisma no backend/API.
- Frontend chamando endpoints proprios em vez de acessar o banco diretamente.

Leia `docs/migracao-supabase-railway.md` antes de iniciar a migracao.

## Seguranca

- Nunca versione `.env`.
- Use `.env.example` somente como modelo.
- Credenciais que ja foram expostas devem ser rotacionadas.
- Como o `.env` ja entrou no historico Git, avalie uma limpeza planejada do historico antes de tornar o repositorio publico ou compartilhar novamente.
- `SUPABASE_SERVICE_ROLE_KEY` so pode existir em backend/API seguro, nunca no frontend.
