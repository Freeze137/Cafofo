import { Router } from 'express'
import * as db from '../db.js'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 2 — Adoções (processos que vinculam um pet a um voluntário)
//
// Chaves estrangeiras: petId (animal adotado) e volunteerId (responsável).
// Ao mudar o status da adoção, o status do pet vinculado é atualizado para
// manter a integridade entre as entidades (ex.: "Concluída" → pet "Adotado").
// ─────────────────────────────────────────────────────────────────────────

const COLLECTION = 'adoptions'
const STATUS = ['Em análise', 'Aprovada', 'Concluída', 'Cancelada']

// Mapeia o status da adoção para o status correspondente do pet vinculado.
const PET_STATUS_BY_ADOPTION = {
  'Em análise': 'Em processo',
  Aprovada: 'Em processo',
  Concluída: 'Adotado',
  Cancelada: 'Disponível',
}

function validateAdoption(body = {}, { partial = false } = {}) {
  const value = {}

  if (body.petId !== undefined) value.petId = String(body.petId).trim()
  else if (!partial) return { error: 'Selecione o pet a ser adotado.' }
  if (!partial && !value.petId) return { error: 'Selecione o pet a ser adotado.' }
  if (value.petId && !db.getById('pets', value.petId)) {
    return { error: 'Pet informado não existe.' }
  }

  if (body.volunteerId !== undefined) {
    value.volunteerId = String(body.volunteerId).trim()
    if (value.volunteerId && !db.getById('volunteers', value.volunteerId)) {
      return { error: 'Voluntário informado não existe.' }
    }
  }

  for (const field of ['adotante', 'contato', 'data', 'observacoes']) {
    if (body[field] !== undefined) value[field] = String(body[field]).trim()
  }

  if (body.status !== undefined) {
    if (!STATUS.includes(body.status)) return { error: 'Status inválido.' }
    value.status = body.status
  } else if (!partial) {
    value.status = 'Em análise'
  }

  return { value }
}

/** Propaga o status da adoção para o pet vinculado. */
function syncPetStatus(adoption) {
  const petStatus = adoption?.petId && PET_STATUS_BY_ADOPTION[adoption.status]
  if (petStatus) db.update('pets', adoption.petId, { status: petStatus })
}

const router = Router()

// JOIN feito no servidor: adoções "achatadas" com dados do pet e do voluntário.
// Alimenta o relatório do frontend (cruzamento das três entidades).
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
  res.json(rows)
})

router.get('/', (_req, res) => res.json(db.list(COLLECTION)))

router.get('/:id', (req, res) => {
  const item = db.getById(COLLECTION, req.params.id)
  if (!item) return res.status(404).json({ error: 'Registro não encontrado.' })
  res.json(item)
})

router.post('/', (req, res) => {
  const { value, error } = validateAdoption(req.body)
  if (error) return res.status(400).json({ error })
  const created = db.create(COLLECTION, value)
  syncPetStatus(created)
  res.status(201).json(created)
})

router.put('/:id', (req, res) => {
  const { value, error } = validateAdoption(req.body, { partial: true })
  if (error) return res.status(400).json({ error })
  const updated = db.update(COLLECTION, req.params.id, value)
  if (!updated) return res.status(404).json({ error: 'Registro não encontrado.' })
  syncPetStatus(updated)
  res.json(updated)
})

router.delete('/:id', (req, res) => {
  const ok = db.remove(COLLECTION, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Registro não encontrado.' })
  res.status(204).end()
})

export default router
