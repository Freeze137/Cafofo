import { Router } from 'express'
import * as db from '../db.js'
import { createValidator, requiredText, optionalText, oneOf } from '../validation/rules.js'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 2 — Adoções (processos que vinculam um pet a um voluntário)
//
// Chaves estrangeiras: petId (animal adotado) e volunteerId (responsável)
// Ao mudar o status da adoção, o status do pet vinculado é atualizado para
// manter a integridade entre as entidades (ex.: "Concluída" → pet "Adotado")
// ─────────────────────────────────────────────────────────────────────────

// Define onde vamos salvar e os status que uma adoção pode ter
const COLLECTION = 'adoptions'
const STATUS = ['Em análise', 'Aprovada', 'Concluída', 'Cancelada']

// Mapeia o status da adoção para o status correspondente do pet vinculado
const PET_STATUS_BY_ADOPTION = {
  'Em análise': 'Em processo',
  Aprovada: 'Em processo',
  Concluída: 'Adotado',
  Cancelada: 'Disponível',
}
// Regras que dependem do banco: o pet e o voluntário precisam existir.
const petMustExist = (_body, value) => {
  if (value.petId && !db.getById('pets', value.petId)) return 'Pet informado não existe.'
}

const volunteerMustExist = (body, value) => {
  if (body.volunteerId === undefined) return
  value.volunteerId = String(body.volunteerId).trim()
  if (value.volunteerId && !db.getById('volunteers', value.volunteerId)) {
    return 'Voluntário informado não existe.'
  }
}

// Verifica se os dados enviados estão corretos: cada linha é uma regra.
// "partial = true" (atualização) não exige o pet nem aplica o status padrão.
export const validateAdoption = createValidator([
  requiredText('petId', 'Selecione o pet a ser adotado.'),
  petMustExist,
  volunteerMustExist,
  optionalText('adotante', 'contato', 'data', 'observacoes'),
  oneOf('status', STATUS, 'Em análise', 'Status inválido.'),
])

//Propaga o status da adoção para o pet vinculado
// Chama o banco de dados para alterar o status do pet
function syncPetStatus(adoption) {
  const petStatus = adoption?.petId && PET_STATUS_BY_ADOPTION[adoption.status]
  if (petStatus) db.update('pets', adoption.petId, { status: petStatus })
}

const router = Router()

//pega dados de Adoções, Pets e Voluntários, cruza os dados e devolve tudo formatado para a tela de relatório
router.get('/report', (_req, res) => {
  const pets = db.list('pets')
  const volunteers = db.list('volunteers')
  const rows = db.list(COLLECTION).map((a) => {
    const pet = pets.find((p) => p.id === a.petId)
    const volunteer = volunteers.find((v) => v.id === a.volunteerId)
    return {
      id: a.id,
      pet: pet?.nome ?? 'Pet removido',
      especie: pet?.especie ?? '—',
      voluntario: volunteer?.nome ?? '—',
      adotante: a.adotante || '—',
      data: a.data,
      status: a.status,
    }
  })
  res.json(rows) // Devolve a lista cruzada
})

//Rota para listar todas as adoções sem cruzar dados
router.get('/', (_req, res) => res.json(db.list(COLLECTION)))

//Rota de busca para adoção específica usando o ID
router.get('/:id', (req, res) => {
  const item = db.getById(COLLECTION, req.params.id)
  if (!item) return res.status(404).json({ error: 'Registro não encontrado.' })
  res.json(item)
})

//Rota para criar uma nova adoção
router.post('/', (req, res) => {
  const { value, error } = validateAdoption(req.body)
  if (error) return res.status(400).json({ error })
  const created = db.create(COLLECTION, value)
  syncPetStatus(created)
  res.status(201).json(created)
})

//Rota para atualizar uma adoção
router.put('/:id', (req, res) => {
  const { value, error } = validateAdoption(req.body, { partial: true }) // Permite atualizar só parte dos dados
  if (error) return res.status(400).json({ error })
  const updated = db.update(COLLECTION, req.params.id, value)
  if (!updated) return res.status(404).json({ error: 'Registro não encontrado.' })
  syncPetStatus(updated)
  res.json(updated)
})

//Rota para deletar uma adoção
router.delete('/:id', (req, res) => {
  const ok = db.remove(COLLECTION, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Registro não encontrado.' })
  res.status(204).end()
})

export default router
