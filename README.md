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
| `frontend/` | React 18 + Vite 7 + Tailwind CSS 3 + React Router 7 | 5173 (dev) |
| `backend/` | Node.js + Express 4 (API REST, autenticação JWT) | 3333 |
| Dados | Arquivo JSON local `backend/src/data/db.json` (gerado a partir do seed) | — |
| Contas | Coleção `users` no mesmo `db.json`, senha só como hash bcrypt | — |
| Sessão de login | Token JWT no `localStorage` do navegador (sem senha) | — |

## ✅ Pré-requisitos

- **Node.js 22.12 ou superior** (22 LTS — ver `.nvmrc`; exigido pelo Vite 7 e pelo Vitest 5)
- npm 9+
- Git

## 🚀 Como executar

O sistema precisa de **dois processos** rodando ao mesmo tempo. Abra **dois terminais**.

**Terminal 1 — backend (API):**

```bash
cd backend
npm install
cp .env.example .env # defina JWT_SECRET (ver comentário no arquivo)
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

Na primeira execução o backend cria `backend/src/data/db.json` com 12 pets, 2 voluntários,
2 adoções e a conta de demonstração. Para voltar aos dados iniciais, apague esse arquivo e
reinicie a API. **Quem já tinha um `db.json` da versão 1.0.0 deve apagá-lo**, para receber
o seed corrigido (status dos pets) e a conta demo.

Contas criadas na versão 1.0.0 ficavam só no navegador e não existem na API: basta se
cadastrar de novo. Ao abrir o app, a lista antiga de usuários (com senhas em texto puro)
é apagada do `localStorage`.

### Variáveis de ambiente

| Variável | Onde | Padrão | Descrição |
| --- | --- | --- | --- |
| `PORT` | backend | `3333` | Porta da API |
| `JWT_SECRET` | backend | aleatório a cada início | Segredo dos tokens de sessão (defina no `.env`) |
| `JWT_EXPIRES_IN` | backend | `8h` | Validade do token |
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

Todas as rotas de dados exigem o cabeçalho `Authorization: Bearer <token>`; sem ele a API
responde **401**. O token vem de `/api/auth/login` ou `/api/auth/register`.

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth/register` | Cria conta (público) → `{ token, user }` |
| POST | `/api/auth/login` | Entra com e-mail e senha (público) → `{ token, user }` |
| GET | `/api/auth/me` | Usuário do token |
| GET/POST | `/api/pets` | Lista / cria pets |
| GET/PUT/DELETE | `/api/pets/:id` | Consulta / atualiza / remove pet (409 se houver adoção vinculada) |
| GET/POST | `/api/volunteers` | Lista / cria voluntários |
| GET/PUT/DELETE | `/api/volunteers/:id` | Consulta / atualiza / remove voluntário |
| GET/POST | `/api/adoptions` | Lista / cria adoções (atualiza o status do pet) |
| GET/PUT/DELETE | `/api/adoptions/:id` | Consulta / atualiza / remove adoção |
| GET | `/api/adoptions/report` | Cruzamento adoções × pets × voluntários |
| GET | `/api/health` | Verificação de saúde (público) |

## 🧪 Testes e integração contínua

```bash
cd backend
npm test             # Vitest + Supertest, com relatório de cobertura (backend/coverage/)
```

O pipeline `.github/workflows/ci.yml` roda a cada push e pull request: no backend, testes
com cobertura e `npm audit --audit-level=high`; no frontend, lint, build e auditoria.

## ⚠️ Limitações conhecidas

Corrigidas na versão 1.1.0 (Parte 2): API sem autenticação, senhas em texto puro, adoção
órfã ao excluir pet, dados iniciais inconsistentes, validação de idade/e-mail só no
formulário, erros com stack trace e ausência de testes. Seguem em aberto:

- "Entrar com Google" ainda não está integrado (o botão informa isso e não cria sessão).
- Todos os usuários têm o mesmo nível de acesso (não há perfis).
- As fotos dos pets trafegam em base64 dentro do JSON (listagem pesada).
- O frontend não tem testes automatizados.

## 🔁 Como contribuir

Veja [CONTRIBUTING.md](CONTRIBUTING.md) (fluxo issue → branch → PR → revisão → merge → tag).
Histórico de versões em [CHANGELOG.md](CHANGELOG.md).
