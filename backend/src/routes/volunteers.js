import { crudRouter } from './crudRouter.js'
import { createValidator, requiredText, optionalText, toBoolean } from '../validation/rules.js'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 3 — Voluntários (equipe que ajuda no abrigo)
// ─────────────────────────────────────────────────────────────────────────

// Limpa e valida os dados: cada linha é uma regra (src/validation).
export const validateVolunteer = createValidator([
  requiredText('nome', 'O nome do voluntário é obrigatório.'),
  optionalText('email', 'telefone', 'funcao', 'disponibilidade'),
  toBoolean('ativo', true), // ativo por padrão
])

// Cria e exporta as rotas de voluntários
export default crudRouter('volunteers', validateVolunteer)
