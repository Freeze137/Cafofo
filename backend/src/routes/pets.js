import { crudRouter } from './crudRouter.js'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 1 — Pets (animais do abrigo)
// ─────────────────────────────────────────────────────────────────────────

const STATUS = ['Disponível', 'Em processo', 'Adotado']

function validatePet(body = {}, { partial = false } = {}) {
  const value = {}

  if (body.nome !== undefined) value.nome = String(body.nome).trim()
  else if (!partial) return { error: 'O nome do pet é obrigatório.' }
  if (!partial && !value.nome) return { error: 'O nome do pet é obrigatório.' }

  if (body.especie !== undefined) value.especie = String(body.especie).trim()
  else if (!partial) value.especie = ''

  for (const field of ['raca', 'porte', 'sexo', 'cor', 'descricao']) {
    if (body[field] !== undefined) value[field] = String(body[field]).trim()
  }

  if (body.foto !== undefined) value.foto = body.foto  // base64 ou null

  if (body.idade !== undefined) value.idade = Number(body.idade) || 0

  if (body.status !== undefined) {
    if (!STATUS.includes(body.status)) return { error: 'Status inválido.' }
    value.status = body.status
  } else if (!partial) {
    value.status = 'Disponível'
  }

  return { value }
}

export default crudRouter('pets', validatePet)