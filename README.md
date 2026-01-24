# 🌱 EcoFlow – Plataforma de Gestão de Resíduos e Métricas ESG

EcoFlow é uma aplicação web desenvolvida para **gestão de resíduos, logística reversa e acompanhamento de métricas ESG**, com foco em clareza, usabilidade e demonstração de regras de negócio por perfil de usuário.

O projeto foi pensado como **MVP / portfólio**, incluindo um **modo demonstração funcional**, sem dependência obrigatória de backend para testes iniciais.

---

## 🚀 Funcionalidades

- 📊 Dashboard com indicadores de sustentabilidade
- ♻️ Controle de materiais e coletas
- 📈 Visualização de métricas ESG
- 👥 Gestão de usuários (acesso restrito)
- 🔐 Autenticação por perfil (role-based access)
- ⚡ Modo Demonstração (login rápido sem backend)

---

## 👤 Perfis de Acesso (Roles)

O sistema trabalha com três perfis distintos:

| Perfil                | Permissões principais                                 |
| --------------------- | ------------------------------------------------------ |
| **Operacional** | Visualizar dashboard, materiais e coletas              |
| **Gestor**      | Acesso a métricas e indicadores                       |
| **Admin**       | Gestão completa, כולל usuários e configurações |

Esses perfis são respeitados pelas rotas protegidas da aplicação.

---

## 🧪 Modo Demonstração

O EcoFlow possui um **modo demo**, ideal para apresentações e testes rápidos.

### Acesso rápido disponível na tela de login:

- 👩 **Maria Silva** – Operacional
- 👨 **João Santos** – Gestor
- 👩‍💼 **Ana Costa** – Admin

➡️ O login demo funciona via `localStorage`, sem necessidade de Supabase ativo.

---

## 🛠️ Tecnologias Utilizadas

- ⚡ **Vite**
- ⚛️ **React + TypeScript**
- 🎨 **Tailwind CSS**
- 🧩 **shadcn/ui**
- 🔁 **React Router**
- 🧠 **Context API (Auth + Roles)**
- 🔐 **Supabase Auth** (opcional / modo real)

---


## 📁 Estrutura do Projeto (simplificada)

src/

├── components/

│   ├── auth/           # ProtectedRoute, controle de acesso

│   ├── ui/             # Componentes reutilizáveis

├── hooks/

│   └── useAuth.tsx     # Contexto de autenticação

├── pages/

│   ├── Auth.tsx

│   ├── Dashboard.tsx

│   ├── Metrics.tsx

│   ├── Users.tsx

│   └── Settings.tsx

├── lib/

│   └── constants.ts    # Usuários demo e infos da aplicação

└── integrations/

└── supabase/       # Cliente Supabase

---

## ▶️ Rodando o projeto localmente

### Pré-requisitos

- Node.js (versão 18+ recomendada)
- npm ou bun

### Passos

```bash
# 1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Entrar na pasta
cd ecoflow-logistics

# 3. Instalar dependências
npm install

# 4. Rodar o projeto
npm run dev
---
A aplicação ficará disponível em:

👉 `http://localhost:8080`



## Objetivo do Projeto

Este projeto foi desenvolvido com foco em:

* Demonstração de **arquitetura frontend**
* Controle de acesso por perfil
* Clareza de regras de negócio
* Experiência do usuário
* Base sólida para evolução futura (API, BI, IA, etc.)


## 👨‍💻 Autor

Desenvolvido por **Rafael Freitas de Paula**

Projeto de estudo, portfólio e demonstração técnica.
```
