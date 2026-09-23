# 🐾 Cafofo Adoção

Sistema web de **adoção de animais** para abrigos: cadastro de pets, controle dos
processos de adoção, gestão de voluntários e relatório consolidado.

> Projeto acadêmico — Engenharia de Software, Universidade Católica de Brasília (UCB).
> Objeto de estudo da disciplina **Qualidade de Software** (Projeto Integrador 2026).

## 👥 Equipe

| Integrante | Papel no projeto de Qualidade |
| --- | --- |
| Pedro Alves de Souza | Caracterização e diagnóstico conceitual |
| Rafael Dias Leitão | Critérios observáveis e métricas |
| Rafael Souza Costa | Análise automatizada e controle de versões (mantenedor do repositório) |
| Yuri Campos Vilarino de Castro Costa | Documentação, gerência de configuração e revisão de PRs |
| Yuri Nicole Silva | Fluxo de desenvolvimento, baseline e diagnóstico final |

## 🧱 Arquitetura

Duas aplicações independentes que conversam por HTTP:

| Camada | Tecnologia | Porta |
| --- | --- | --- |
| `frontend/` | React 18 + Vite 5 + Tailwind CSS 3 + React Router 6 | 5173 (dev) |
| `backend/` | Node.js + Express 4 (API REST) | 3333 |
| Dados | Arquivo JSON local `backend/src/data/db.json` (gerado a partir do seed) | — |
| Sessão de login | `localStorage` do navegador (modo demonstração) | — |

## ✅ Pré-requisitos

- **Node.js 18.11 ou superior** (recomendado: 20 LTS — ver `.nvmrc`)
- npm 9+
- Git

## 🚀 Como executar

O sistema precisa de **dois processos** rodando ao mesmo tempo. Abra **dois terminais**.

**Terminal 1 — backend (API):**

```bash
cd backend
npm install
npm run dev          # API em http://localhost:3333/api
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm install
npm run dev          # interface em http://localhost:5173
```

Teste rápido da API: `curl http://localhost:3333/api/health` deve responder `{"status":"ok",...}`.

### Conta de demonstração

- E-mail: `demo@cafofopeludos.com`
- Senha: `123456`

Na primeira execução o backend cria `backend/src/data/db.json` com 12 pets, 2 voluntários
e 2 adoções de exemplo. Para voltar aos dados iniciais, apague esse arquivo e reinicie a API.

### Variáveis de ambiente

| Variável | Onde | Padrão | Descrição |
| --- | --- | --- | --- |
| `PORT` | backend | `3333` | Porta da API |
| `VITE_API_URL` | frontend | `http://localhost:3333/api` | URL base da API |

Modelos em `backend/.env.example` e `frontend/.env.example`.

## 📜 Scripts

| Pasta | Comando | Função |
| --- | --- | --- |
| backend | `npm run dev` | API com recarga automática (`node --watch`) |
| backend | `npm start` | API em modo normal |
| frontend | `npm run dev` | Servidor de desenvolvimento Vite |
| frontend | `npm run build` | Build de produção em `frontend/dist` |
| frontend | `npm run preview` | Serve o build localmente |
| frontend | `npm run lint` | ESLint (0 avisos permitidos) |

## 🗂️ Estrutura

```
Cafofo/
├── backend/
│   └── src/
│       ├── server.js            # inicialização e rotas
│       ├── db.js                # persistência em arquivo JSON
│       ├── data/seed.js         # dados iniciais (fotos em base64)
│       └── routes/              # crudRouter genérico + pets, adoptions, volunteers
├── frontend/
│   └── src/
│       ├── App.jsx              # rotas (públicas e protegidas)
│       ├── context/AuthContext.jsx
│       ├── services/            # cliente da API (fetch)
│       ├── components/          # layout, formulários, UI
│       └── pages/               # Landing, Login, Dashboard, CRUDs, Relatório
└── docs/qualidade/              # configuração da análise de qualidade
```

## 🔌 Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET/POST | `/api/pets` | Lista / cria pets |
| GET/PUT/DELETE | `/api/pets/:id` | Consulta / atualiza / remove pet |
| GET/POST | `/api/volunteers` | Lista / cria voluntários |
| GET/PUT/DELETE | `/api/volunteers/:id` | Consulta / atualiza / remove voluntário |
| GET/POST | `/api/adoptions` | Lista / cria adoções (atualiza o status do pet) |
| GET/PUT/DELETE | `/api/adoptions/:id` | Consulta / atualiza / remove adoção |
| GET | `/api/adoptions/report` | Cruzamento adoções × pets × voluntários |
| GET | `/api/health` | Verificação de saúde |

## ⚠️ Limitações conhecidas (baseline da Parte 1)

Registradas no diagnóstico de qualidade e tratadas na Parte 2:

- A API **não exige autenticação**; a proteção de rotas existe só no frontend.
- Usuários e senhas ficam no `localStorage` **em texto puro** (modo demonstração).
- O botão "Entrar com Google" apenas simula uma sessão.
- Excluir um pet com adoção vinculada deixa a adoção órfã.
- Não há testes automatizados.

## 🔁 Como contribuir

Veja [CONTRIBUTING.md](CONTRIBUTING.md) (fluxo issue → branch → PR → revisão → merge → tag).
Histórico de versões em [CHANGELOG.md](CHANGELOG.md).
