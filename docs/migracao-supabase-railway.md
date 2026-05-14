# Migracao futura: Supabase para Railway + Prisma

## Situacao atual

O projeto ainda usa Supabase diretamente no frontend Vite/React. O banco atual esta no Supabase e as migrations usam recursos especificos como Supabase Auth, `auth.users`, `auth.uid()`, RLS, policies, triggers e funcoes SQL.

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
