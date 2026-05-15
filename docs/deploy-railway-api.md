# Deploy da API no Railway

Este guia prepara a API Express para rodar no Railway usando PostgreSQL Railway e Prisma.

## Servico

1. Crie um novo servico no Railway a partir deste repositorio.
2. Se o repositorio for monorepo ou tiver root customizado, configure o root directory para a raiz deste projeto.
3. Use o banco PostgreSQL no mesmo projeto Railway quando possivel.
4. Configure as variaveis de ambiente do servico da API.

## Comandos

Build command:

```bash
npm run server:build
```

Start command:

```bash
npm run server:start
```

O `postinstall` executa `prisma generate`, entao o Prisma Client e gerado antes do build/start. O build da API compila o TypeScript para `dist-server` em CommonJS e grava um `package.json` local para o Node executar o servidor compilado corretamente. Nao rode `prisma migrate reset` em producao. Rode migrations em producao apenas em uma etapa explicita e planejada.

## Variaveis

Configure no servico da API:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1d
AUTH_COOKIE_NAME=ecoflow_token
CORS_ORIGIN=https://seu-front.vercel.app
NODE_ENV=production
```

Railway tambem fornece `PORT` automaticamente; nao precisa configurar manualmente.

Use a `DATABASE_URL` interna do Railway se a API estiver no mesmo projeto Railway do banco. Use `DATABASE_PUBLIC_URL` apenas para acesso local, ferramentas como Beekeeper Studio ou diagnostico externo.

Nunca coloque `DATABASE_URL`, `JWT_SECRET` ou outras variaveis privadas no frontend/Vercel.

## CORS e cookies

`CORS_ORIGIN` deve ser exatamente a URL do frontend na Vercel, por exemplo:

```env
CORS_ORIGIN=https://ecoflowlogistics.vercel.app
```

Em `NODE_ENV=production`, o cookie de auth usa:

- `httpOnly: true`
- `secure: true`
- `sameSite: "none"`

Isso permite frontend e API em dominios diferentes usando `credentials: "include"`.

## Verificacao

Depois do deploy, teste:

```bash
curl https://sua-api-production.up.railway.app/api/health
curl https://sua-api-production.up.railway.app/api/health/db
```

Rotas protegidas devem retornar `401` sem cookie, por exemplo:

```bash
curl https://sua-api-production.up.railway.app/api/materials
```
