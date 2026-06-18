import { crudRouter } from './crudRouter.js'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 1 — Pets (animais do abrigo)
// ─────────────────────────────────────────────────────────────────────────
// Lista de status permitidos para um pet
const STATUS = ['Disponível', 'Em processo', 'Adotado']

// Limpa e valida os dados enviados
function validatePet(body = {}, { partial = false } = {}) {
  const value = {}

  // Exige que o nome seja preenchido
  if (body.nome !== undefined) value.nome = String(body.nome).trim()
  else if (!partial) return { error: 'O nome do pet é obrigatório.' }
  if (!partial && !value.nome) return { error: 'O nome do pet é obrigatório.' }

  // Garante que a espécie seja tratada como texto
  if (body.especie !== undefined) value.especie = String(body.especie).trim()
  else if (!partial) value.especie = ''

  // Remove espaços desnecessários
  for (const field of ['raca', 'porte', 'sexo', 'cor', 'descricao']) {
    if (body[field] !== undefined) value[field] = String(body[field]).trim()
  }

  // Repassa o arquivo de imagem
  if (body.foto !== undefined) value.foto = body.foto  // base64 ou null

  // Converte a idade para número
  if (body.idade !== undefined) value.idade = Number(body.idade) || 0

  // Confere se o status existe na lista padrão Disponível
  if (body.status !== undefined) {
    if (!STATUS.includes(body.status)) return { error: 'Status inválido.' }
    value.status = body.status
  } else if (!partial) {
    value.status = 'Disponível'
  }

  return { value }
}

// Cria e exporta todas as rotas
export default crudRouter('pets', validatePet)