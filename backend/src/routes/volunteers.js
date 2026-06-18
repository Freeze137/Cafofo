import { crudRouter } from './crudRouter.js'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 3 — Voluntários (equipe que ajuda no abrigo)
// ─────────────────────────────────────────────────────────────────────────

// Limpa e valida os dados
function validateVolunteer(body = {}, { partial = false } = {}) {
  const value = {}

  // Exige que o nome nao fique em branco
  if (body.nome !== undefined) value.nome = String(body.nome).trim()
  else if (!partial) return { error: 'O nome do voluntário é obrigatório.' }
  if (!partial && !value.nome) return { error: 'O nome do voluntário é obrigatório.' }

  // Remove espaços desnecessários
  for (const field of ['email', 'telefone', 'funcao', 'disponibilidade']) {
    if (body[field] !== undefined) value[field] = String(body[field]).trim()
  }

  // Garante que o status seja verdadeiro/falso padrao true
  if (body.ativo !== undefined) value.ativo = Boolean(body.ativo)
  else if (!partial) value.ativo = true

  return { value }
}

// Cria e exporta as rotas de voluntários
export default crudRouter('volunteers', validateVolunteer)
