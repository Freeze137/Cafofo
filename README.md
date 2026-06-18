# 🐾 CAFOFO ADOÇÃO

Sistema de **adoção de animais** dividido em duas aplicações independentes:

- **`frontend/`** — SPA em **React + Vite + Tailwind** (landing page, autenticação
  e painel de gestão).
- **`backend/`** — **API REST em Node.js + Express** com persistência em arquivo
  JSON, que expõe os três CRUDs do sistema.

As duas partes rodam isoladamente: o frontend consome a API do backend via HTTP.

## ✨ Funcionalidades

- **Landing page** responsiva e animada (Hero, Como adotar, Histórias, CTA).
- **Autenticação** (login, cadastro e logout) com sessão e bloqueio de rotas
  privadas — via Context API (`AuthContext`).
- **CRUD 1 — Pets**: cadastro, edição, listagem e remoção dos animais do abrigo.
- **CRUD 2 — Adoções**: processos de adoção, vinculando pet + voluntário (FKs).
- **CRUD 3 — Voluntários**: equipe que ajuda no abrigo.
- **Relatório com JOIN**: cruzamento Adoções × Pets × Voluntários, calculado no
  backend (`GET /api/adoptions/report`).

## 🛠️ Stack

| Camada       | Frontend                          | Backend              |
| ------------ | --------------------------------- | -------------------- |
| Runtime      | Vite + React 18                   | Node.js + Express    |
| Roteamento   | React Router DOM v6               | Express Router       |
| Estilização  | Tailwind CSS                      | —                    |
| UI / Animação| Lucide React + Framer Motion      | —                    |
| Persistência | API REST (ou Firebase p/ auth)    | Arquivo JSON (`db.json`) |

## 🚀 Como executar

São **dois processos** — abra dois terminais.

### 1. Backend (porta 3333)

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

Acesse **http://localhost:5173**. O frontend aponta para `http://localhost:3333/api`
por padrão (configurável em `frontend/.env` via `VITE_API_URL`).

### 🔑 Conta de demonstração

O login usa um backend local (localStorage) e já vem com um usuário de teste:

- **E-mail:** `demo@cafofopeludos.com`
- **Senha:** `123456`

Os dados das três entidades (pets, adoções, voluntários) são semeados pelo
**backend** na primeira execução.

## 🗂️ Estrutura de pastas

```
Cafofo/
├── README.md
├── frontend/                     # Aplicação React (interface)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx               # Rotas
│       ├── context/AuthContext.jsx
│       ├── services/             # Cliente da API REST
│       │   ├── api.js            # fetch + fábrica de CRUD
│       │   ├── petService.js        # CRUD 1
│       │   ├── adoptionService.js   # CRUD 2 (+ relatório/JOIN)
│       │   └── volunteerService.js  # CRUD 3
│       ├── components/
│       │   ├── pets/ adoptions/ volunteers/   # formulários dos CRUDs
│       │   ├── layout/ ui/ landing/
│       └── pages/                # Landing, Login, Dashboard, CRUDs, Relatório
└── backend/                      # API REST (Express)
    ├── package.json
    └── src/
        ├── server.js             # Inicialização + montagem das rotas
        ├── db.js                 # CRUD genérico sobre db.json
        ├── data/seed.js          # Dados iniciais
        └── routes/
            ├── crudRouter.js     # Fábrica de rotas REST genéricas
            ├── pets.js           # CRUD 1
            ├── adoptions.js      # CRUD 2 (+ /report)
            └── volunteers.js     # CRUD 3
```

## 🔌 Endpoints da API

| Método | Rota                    | Descrição                       |
| ------ | ----------------------- | ------------------------------- |
| CRUD   | `/api/pets`             | Pets                            |
| CRUD   | `/api/adoptions`        | Adoções                         |
| CRUD   | `/api/volunteers`       | Voluntários                     |
| GET    | `/api/adoptions/report` | JOIN adoções × pets × volunt.   |
| GET    | `/api/health`           | Healthcheck                     |

## 🔥 Firebase (opcional, só para autenticação)

O app roda sem configuração usando `localStorage` para a sessão. Para usar o
Firebase Auth, copie `frontend/.env.example` para `frontend/.env` e preencha as
chaves `VITE_FIREBASE_*` (ver `frontend/src/firebase/firebase.js`).
