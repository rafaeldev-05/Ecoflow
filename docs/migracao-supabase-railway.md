# Migracao futura: Supabase para Railway + Prisma

## Situacao atual

O projeto ainda usa Supabase diretamente no frontend Vite/React. O banco atual esta no Supabase e as migrations usam recursos especificos como Supabase Auth, `auth.users`, `auth.uid()`, RLS, policies, triggers e funcoes SQL.

## Auth proprio em preparacao

A tabela `users` foi criada no PostgreSQL Railway pela migration Prisma `20260514174821_create_users`. Ela usa uma role principal por usuario por meio do enum `app_role`, com os valores `admin`, `gestor` e `operacional`.

Nesta etapa, Auth ainda nao foi migrado. Supabase Auth continua ativo, e login/logout continuam passando pelo fluxo existente do frontend. Os arquivos legados em `src/integrations/supabase/*`, `useAuth`, `Auth.tsx`, `Users.tsx` e `ProtectedRoute` nao foram removidos nem alterados nesta etapa.

Nao foram criadas tabelas `auth.users`, `profiles` ou `user_roles` no Prisma para esta etapa. Tambem nao foram criados endpoints de Auth, middleware de permissao ou usuario admin novo.

Endpoints server-side de Auth foram preparados no backend Express, mas o frontend ainda nao foi migrado para usa-los. O token da API propria e gravado em cookie httpOnly, nao em `localStorage`.

### Script de admin

O primeiro usuario admin deve ser criado apenas por comando explicito:

```bash
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="senha-segura" ADMIN_FULL_NAME="Admin" npm run admin:create
```

No PowerShell:

```powershell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="senha-segura"
$env:ADMIN_FULL_NAME="Admin"
npm run admin:create
```

Se o email ja existir, o script nao duplica usuarios. Para promover um usuario existente para admin, a acao precisa ser explicita com `ADMIN_PROMOTE_EXISTING=true` ou `--promote-existing`.

### Endpoints de Auth proprio

- `POST /api/auth/login`: valida email/senha e cria o cookie httpOnly.
- `GET /api/auth/me`: exige cookie valido e retorna o usuario autenticado.
- `POST /api/auth/logout`: limpa o cookie.

Em desenvolvimento, o cookie usa `httpOnly: true`, `sameSite: "lax"` e `secure: false`. Em producao, usa `httpOnly: true`, `sameSite: "none"` e `secure: true`, adequado quando frontend e API estao em dominios diferentes.

### Proximos passos de frontend

- Adaptar `useAuth` e `Auth.tsx` para consumir a API propria.
- Manter o fluxo visual atual.
- Depois migrar gradualmente `Users.tsx` para a API propria.

## Situacao desejada

A arquitetura futura deve usar PostgreSQL no Railway, Prisma como camada de acesso ao banco e endpoints proprios no backend/API. O frontend deve chamar esses endpoints, nao acessar o banco diretamente.

## O que nao sera feito agora

- Nao migrar dados.
- Nao trocar o banco de producao.
- Nao remover Supabase Auth ainda.
- Nao remover RLS, policies ou triggers sem plano de substituicao.
- Nao substituir todas as chamadas `supabase.from(...)` nesta etapa.

## Estrategia recomendada

1. Criar um banco PostgreSQL no Railway.
2. Configurar `DATABASE_URL` somente no ambiente server-side.
3. Validar o `prisma/schema.prisma` contra o schema real.
4. Introspectar ou recriar o schema no Prisma.
5. Criar migrations Prisma.
6. Criar seed, se necessario.
7. Criar endpoints proprios para materiais, coletas, metricas e usuarios.
8. Substituir gradualmente chamadas diretas ao Supabase por chamadas aos endpoints.
9. Testar localmente autenticacao, autorizacao e regras de negocio.
10. Migrar dados com janela controlada.
11. Validar producao antes de desligar dependencias antigas.

## Railway e Beekeeper Studio

Railway hospeda o banco PostgreSQL. Beekeeper Studio e apenas uma ferramenta cliente para conectar, visualizar e administrar o banco. O banco nao fica no Beekeeper; ele fica no Railway, e o Beekeeper pode ser usado para acessa-lo visualmente.

## Observacao sobre migrations atuais

As migrations em `supabase/migrations` devem ser convertidas ou revalidadas antes de virar migrations Prisma. Elas contem regras acopladas ao Supabase Auth/RLS, entao nao devem ser copiadas cegamente para Railway.
