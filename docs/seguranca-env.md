# Variaveis de ambiente e credenciais

O arquivo `.env` e qualquer variacao `.env.*` nao devem ser commitados. Use `.env.example` apenas como modelo, sem credenciais reais.

Variaveis com prefixo `VITE_` sao expostas no bundle do frontend. Use esse prefixo apenas para valores publicos, como `VITE_API_URL`.

Variaveis privadas como `DATABASE_URL` e `JWT_SECRET` devem existir somente em backend/API ou no provedor de deploy. Elas nao devem ser lidas por codigo Vite/React nem enviadas ao navegador. Nao crie `VITE_DATABASE_URL`.

Como o `.env` ja entrou no historico Git deste repositorio, as credenciais expostas devem ser rotacionadas. Tambem pode ser necessario limpar o historico com uma ferramenta propria, como `git filter-repo` ou BFG Repo-Cleaner, mas isso deve ser feito em uma etapa planejada e nao automaticamente.
