# CAFOFO ADOÇÃO — Backend (API REST)

API em **Node.js + Express** para o sistema de adoção de animais. Persiste os
dados em um arquivo JSON (`db.json`), gerado automaticamente a partir do seed na
primeira execução.

## Como rodar

```bash
cd backend
npm install
npm run dev      # com --watch (recarrega ao salvar)
# ou
npm start
```

A API sobe em `http://localhost:3333/api` (porta configurável via `PORT`).

## Endpoints

Cada entidade expõe um CRUD REST completo:

| Método | Rota                     | Ação                          |
| ------ | ------------------------ | ----------------------------- |
| GET    | `/api/pets`              | Lista pets                    |
| GET    | `/api/pets/:id`          | Busca um pet                  |
| POST   | `/api/pets`              | Cria pet                      |
| PUT    | `/api/pets/:id`          | Atualiza pet                  |
| DELETE | `/api/pets/:id`          | Remove pet                    |
| ...    | `/api/volunteers`        | CRUD de voluntários           |
| ...    | `/api/adoptions`         | CRUD de adoções               |
| GET    | `/api/adoptions/report`  | JOIN adoções × pets × volunt. |
| GET    | `/api/health`            | Healthcheck                   |

> As adoções referenciam `petId` e `volunteerId`. Concluir/cancelar uma adoção
> atualiza automaticamente o status do pet vinculado.
