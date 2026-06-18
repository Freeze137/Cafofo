import express from 'express'
import cors from 'cors'

import petsRouter from './routes/pets.js'
import adoptionsRouter from './routes/adoptions.js'
import volunteersRouter from './routes/volunteers.js'

// ─────────────────────────────────────────────────────────────────────────
// CAFOFO ADOÇÃO — API REST
//
// Servidor Express que expõe os três CRUDs do sistema de adoção:
//   /api/pets        → animais do abrigo
//   /api/adoptions   → processos de adoção (+ /api/adoptions/report para JOIN)
//   /api/volunteers  → equipe de voluntários
//
// A persistência fica isolada em src/db.js (arquivo JSON). O frontend
// consome esta API e não conhece detalhes do armazenamento.
// ─────────────────────────────────────────────────────────────────────────

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())

// Healthcheck simples.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cafofo-adocao', time: new Date().toISOString() })
})

// Rotas dos CRUDs.
app.use('/api/pets', petsRouter)
app.use('/api/adoptions', adoptionsRouter)
app.use('/api/volunteers', volunteersRouter)

// 404 para rotas desconhecidas da API.
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

app.listen(PORT, () => {
  console.log(`🐾 API CAFOFO ADOÇÃO rodando em http://localhost:${PORT}/api`)
})
