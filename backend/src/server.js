import app from './app.js'

// ─────────────────────────────────────────────────────────────────────────
// CAFOFO ADOÇÃO — Ponto de entrada do servidor
//
// Apenas sobe o `app` (src/app.js) na porta configurada.
// ─────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`🐾 API CAFOFO ADOÇÃO rodando em http://localhost:${PORT}/api`)
})
