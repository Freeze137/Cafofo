import { crudRouter } from './crudRouter.js'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 3 — Voluntários (equipe que ajuda no abrigo)
// ─────────────────────────────────────────────────────────────────────────

/** Valida e normaliza o corpo de um voluntário. */
function validateVolunteer(body = {}, { partial = false } = {}) {
  const value = {}

  if (body.nome !== undefined) value.nome = String(body.nome).trim()
  else if (!partial) return { error: 'O nome do voluntário é obrigatório.' }
  if (!partial && !value.nome) return { error: 'O nome do voluntário é obrigatório.' }

  for (const field of ['email', 'telefone', 'funcao', 'disponibilidade']) {
    if (body[field] !== undefined) value[field] = String(body[field]).trim()
  }

  if (body.ativo !== undefined) value.ativo = Boolean(body.ativo)
  else if (!partial) value.ativo = true

  return { value }
}

export default crudRouter('volunteers', validateVolunteer)
