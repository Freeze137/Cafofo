# 🐾 CAFOFOPELUDOS

SPA moderna de **pet shop & hotelzinho** desenvolvida em **React + Vite**, com
landing page interativa, autenticação, três CRUDs completos e um relatório com
JOIN entre entidades.

> Projeto desenvolvido para a **Avaliação N2 — Programação Web**.

## ✨ Funcionalidades

- **Landing page** responsiva e animada (Hero, Serviços, Depoimentos, CTA).
- **Autenticação** (login, cadastro e logout) com controle de sessão e bloqueio
  das rotas privadas — via Context API (`AuthContext`).
- **CRUD 1 — Pets**: adicionar, listar, editar e remover os pets do tutor.
- **CRUD 2 — Produtos**: catálogo da lojinha (tabela completa).
- **CRUD 3 — Agendamentos**: marcar serviços relacionando pet + serviço.
- **Relatório com JOIN**: cruzamento entre Agendamentos × Pets × Serviços × Tutor,
  usando `map()` + `find()` com chaves estrangeiras simuladas.

## 🛠️ Stack

| Camada            | Tecnologia                          |
| ----------------- | ----------------------------------- |
| Build / Dev       | Vite                                |
| UI                | React 18 + React Router DOM v6      |
| Estilização       | Tailwind CSS (mobile-first)         |
| Ícones / Animação | Lucide React + Framer Motion        |
| Estado global     | Context API                         |
| Persistência      | localStorage (padrão) ou Firebase   |

## 🚀 Como executar

```bash
npm install
npm run dev
```

Acesse **http://localhost:5173**.

### 🔑 Conta de demonstração

O sistema já vem com dados de exemplo (pets, produtos e agendamentos):

- **E-mail:** `demo@cafofopeludos.com`
- **Senha:** `123456`

Ou crie uma conta nova na tela de cadastro.

## 🗂️ Estrutura de pastas

```
cafofopeludos/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── public/
│   └── paw.svg
└── src/
    ├── main.jsx                 # Ponto de entrada (Router + AuthProvider)
    ├── App.jsx                  # Arquivo central de ROTAS
    ├── index.css                # Tailwind + estilos globais
    ├── firebase/
    │   └── firebase.js          # Configuração do Firebase (opcional)
    ├── context/
    │   └── AuthContext.jsx      # Estado de autenticação (Context API)
    ├── services/                # Camada de acesso a dados (isolada)
    │   ├── config.js            # Seleciona o backend (local x firebase)
    │   ├── localDriver.js       # CRUD genérico em localStorage
    │   ├── petService.js        # CRUD 1
    │   ├── productService.js    # CRUD 2
    │   ├── appointmentService.js# CRUD 3
    │   └── serviceCatalog.js    # Catálogo de serviços (JOIN)
    ├── data/
    │   └── seed.js              # Dados iniciais de demonstração
    ├── components/
    │   ├── ProtectedRoute.jsx   # Bloqueio de rotas sem login
    │   ├── layout/              # Navbar, Footer, DashboardLayout
    │   ├── ui/                  # Modal, Field, ConfirmDialog, etc.
    │   ├── landing/             # Hero, Services, Testimonials
    │   ├── pets/                # PetCard, PetForm
    │   ├── appointments/        # AppointmentForm
    │   └── products/            # ProductForm
    └── pages/                   # Landing, Login, Register, Dashboard, CRUDs, Relatório
```

## 🔥 Ativando o Firebase (opcional)

O app roda **sem nenhuma configuração** usando `localStorage`. Para usar o
backend real do Firebase (Auth + Firestore):

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. Copie `.env.example` para `.env` e preencha as chaves `VITE_FIREBASE_*`.
3. A flag `USE_FIREBASE` (em `src/services/config.js`) é ativada automaticamente
   quando há credenciais, e o `AuthContext` passa a usar Email/Senha + Google.

## 📜 Scripts

| Comando           | Descrição                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento (Vite) |
| `npm run build`   | Build de produção                  |
| `npm run preview` | Pré-visualiza o build              |
| `npm run lint`    | Análise estática com ESLint        |
