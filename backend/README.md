# CAFOFO ADOÇÃO — Backend (API REST)

API em **Node.js + Express** para o sistema de adoção de animais. Persiste os
dados em um arquivo JSON (`db.json`), gerado automaticamente a partir do seed na
primeira execução.

## Como rodar

```bash
cd backend
npm install
cp .env.example .env   # defina JWT_SECRET
npm run dev      # com --watch (recarrega ao salvar)
# ou
npm start
```

A API sobe em `http://localhost:3333/api` (porta configurável via `PORT`).

## Testes

```bash
npm test         # Vitest + Supertest com cobertura (v8)
```

## Autenticação

`POST /api/auth/register` e `POST /api/auth/login` devolvem `{ token, user }`. As rotas de
dados exigem `Authorization: Bearer <token>` (401 sem ele). Senhas são gravadas só como
hash bcrypt. Erros são sempre respondidos em JSON (`{ "error": "..." }`), sem stack trace.

## Endpoints

Cada entidade expõe um CRUD REST completo (todas exigem token):

| Método | Rota                     | Ação                          |
| ------ | ------------------------ | ----------------------------- |
| GET    | `/api/pets`              | Lista pets                    |
| GET    | `/api/pets/:id`          | Busca um pet                  |
| POST   | `/api/pets`              | Cria pet                      |
| PUT    | `/api/pets/:id`          | Atualiza pet                  |
| DELETE | `/api/pets/:id`          | Remove pet (409 se houver adoção) |
| ...    | `/api/volunteers`        | CRUD de voluntários           |
| ...    | `/api/adoptions`         | CRUD de adoções               |
| GET    | `/api/adoptions/report`  | JOIN adoções × pets × volunt. |
| GET    | `/api/health`            | Healthcheck                   |

> As adoções referenciam `petId` e `volunteerId`. Concluir/cancelar uma adoção
> atualiza automaticamente o status do pet vinculado.
