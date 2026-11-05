import express from 'express'
import cors from 'cors'

import petsRouter from './routes/pets.js'
import adoptionsRouter from './routes/adoptions.js'
import volunteersRouter from './routes/volunteers.js'
import authRouter from './routes/auth.js'
import { errorHandler } from './middleware/errorHandler.js'

// ─────────────────────────────────────────────────────────────────────────
// CAFOFO ADOÇÃO — Aplicação Express
//
// Monta a API REST com os três CRUDs do sistema de adoção:
//   /api/pets        → animais do abrigo
//   /api/adoptions   → processos de adoção (+ /api/adoptions/report para JOIN)
//   /api/volunteers  → equipe de voluntários
//   /api/auth        → cadastro, login e sessão (JWT; senhas com bcrypt)
//
// O `app` é exportado separado do `listen` (src/server.js) para que os
// testes automatizados (Vitest + Supertest) chamem a API sem abrir porta.
// A persistência fica isolada em src/db.js (arquivo JSON).
// ─────────────────────────────────────────────────────────────────────────

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Healthcheck simples.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cafofo-adocao', time: new Date().toISOString() })
})

// Contas de usuário (cadastro e login).
app.use('/api/auth', authRouter)

// Rotas dos CRUDs.
app.use('/api/pets', petsRouter)
app.use('/api/adoptions', adoptionsRouter)
app.use('/api/volunteers', volunteersRouter)

// 404 para rotas desconhecidas da API.
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

// Erros (JSON malformado, exceções) sempre em JSON, sem stack trace.
app.use(errorHandler)

export default app
