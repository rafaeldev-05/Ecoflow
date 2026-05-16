# Deploy da API via Railway CLI

Este guia cobre o deploy manual da API Express no Railway usando `railway up`, sem depender da integracao GitHub do Railway.

## 1. Instalar Railway CLI

No Windows, ha duas opcoes comuns:

- instalar via npm global no proprio Windows;
- usar WSL, caso a instalacao padrao do Railway recomende esse caminho no seu ambiente.

Opcao via npm:

```bash
npm install -g @railway/cli
```

Confirme a instalacao:

```bash
railway --version
```

## 2. Login

Entre com a conta Railway onde esta o projeto/banco PostgreSQL.

No seu caso, use a conta:

```txt
rafael.fp@discente.ufma.br
```

Comando:

```bash
railway login
```

## 3. Linkar o projeto

Dentro da pasta raiz deste projeto:

```bash
railway link
```

Durante o fluxo:

1. Escolha o projeto Railway onde ja existe o PostgreSQL.
2. Escolha ou crie o servico da API.
3. Nao selecione o servico Postgres como destino do deploy da API.

A API deve ser um servico separado dentro do mesmo projeto Railway do banco.

## 4. Configurar variaveis no servico da API

Configure as variaveis no servico da API no Railway:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<valor-forte>
JWT_EXPIRES_IN=1d
AUTH_COOKIE_NAME=ecoflow_token
CORS_ORIGIN=https://ecoflow-five.vercel.app
NODE_ENV=production
```

Notas importantes:

- `DATABASE_URL` deve apontar para a URL interna do Postgres quando API e banco estiverem no mesmo projeto Railway.
- `DATABASE_PUBLIC_URL` deve ser usada apenas para acesso local, Beekeeper Studio ou diagnostico externo.
- `VITE_API_URL` nao deve ficar no servico da API.
- `VITE_API_URL` deve ficar somente na Vercel/frontend.
- Nao coloque `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` ou `AUTH_COOKIE_NAME` na Vercel.

## 5. Deploy

Com o projeto linkado e o servico correto selecionado:

```bash
railway up
```

Se houver multiplos servicos e voce quiser informar explicitamente o servico da API:

```bash
railway up --service Ecoflow
```

Use o nome real do servico da API no Railway. Se o CLI perguntar, selecione o servico da API, nao o Postgres.

## 6. Logs

Acompanhe os logs:

```bash
railway logs
```

Se houver multiplos servicos:

```bash
railway logs --service Ecoflow
```

## 7. Gerar dominio publico

Depois do deploy:

1. Abra o Railway.
2. Entre no servico da API.
3. Va em `Settings` -> `Networking`.
4. Clique em `Generate Domain` ou opcao equivalente.

O dominio ficara parecido com:

```txt
https://sua-api.up.railway.app
```

## 8. Testar API publica

Teste no navegador ou terminal:

```bash
curl https://sua-api.up.railway.app/api/health
curl https://sua-api.up.railway.app/api/health/db
```

Rotas protegidas devem retornar `401` sem cookie:

```bash
curl https://sua-api.up.railway.app/api/materials
```

## 9. Configurar Vercel

Na Vercel, configure somente a URL publica da API:

```env
VITE_API_URL=https://sua-api.up.railway.app
```

Nao coloque na Vercel:

```txt
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
AUTH_COOKIE_NAME
```

Depois de configurar `VITE_API_URL`, faca redeploy do frontend.

## 10. Scripts usados pelo Railway

Build command:

```bash
npm run server:build
```

Start command:

```bash
npm run server:start
```

O `postinstall` executa `prisma generate`, entao o Prisma Client e gerado antes do start. Nao rode `prisma migrate reset` em producao.
