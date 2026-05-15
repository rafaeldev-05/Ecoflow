# Deploy do frontend na Vercel

Este guia prepara o frontend Vite/React para rodar na Vercel consumindo a API Express hospedada no Railway.

## Projeto

1. Crie um novo projeto na Vercel a partir deste repositorio.
2. Configure o root directory para a raiz deste projeto, se necessario.
3. Mantenha o framework como Vite.

## Comandos

Build command:

```bash
npm run build
```

Output directory:

```txt
dist
```

## Variaveis

Configure na Vercel:

```env
VITE_API_URL=https://sua-api-production.up.railway.app
```

Nao configure no frontend:

- `DATABASE_URL`
- `JWT_SECRET`
- `AUTH_COOKIE_NAME`
- `JWT_EXPIRES_IN`

Depois de alterar `VITE_API_URL`, faca redeploy do frontend.

## Cookies e CORS

O frontend envia cookies para a API usando `credentials: "include"`. Para isso funcionar em producao:

- A API precisa estar com `NODE_ENV=production`.
- A API precisa ter `CORS_ORIGIN` igual a URL da Vercel.
- O cookie da API deve usar `secure: true` e `sameSite: "none"`.

## Verificacao

Depois do deploy:

1. Acesse a URL da Vercel.
2. Faca login com um usuario admin.
3. Atualize a pagina e confirme que a sessao continua ativa.
4. Acesse Dashboard, Materials, Collections, Metrics e Users.
5. Faca logout e confirme que rotas protegidas voltam para a tela de login.
