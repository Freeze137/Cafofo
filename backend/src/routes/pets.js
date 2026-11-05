import { crudRouter } from './crudRouter.js'
import {
  createValidator, requiredText, textWithDefault, optionalText,
  passthrough, integerBetween, oneOf,
} from '../validation/rules.js'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 1 — Pets (animais do abrigo)
// ─────────────────────────────────────────────────────────────────────────
// Lista de status permitidos para um pet
const STATUS = ['Disponível', 'Em processo', 'Adotado']

// Limpa e valida os dados enviados: cada linha é uma regra (src/validation).
export const validatePet = createValidator([
  requiredText('nome', 'O nome do pet é obrigatório.'),
  textWithDefault('especie', ''),
  optionalText('raca', 'porte', 'sexo', 'cor', 'descricao'),
  passthrough('foto'), // base64 ou null
  integerBetween('idade', 0, 30, 'A idade deve ser um número inteiro entre 0 e 30.'),
  oneOf('status', STATUS, 'Disponível', 'Status inválido.'),
])

// Cria e exporta todas as rotas
export default crudRouter('pets', validatePet)
