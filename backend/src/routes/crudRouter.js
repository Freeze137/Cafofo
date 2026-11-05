import { Router } from 'express'
import * as db from '../db.js'

// ─────────────────────────────────────────────────────────────────────────
// crudRouter — Fábrica de rotas REST genéricas
//
// Monta um conjunto completo de endpoints CRUD sobre uma coleção do banco,
// evitando repetir a mesma estrutura em cada entidade (pets, voluntários,
// adoções). Um `validate` opcional sanitiza/valida o corpo antes de gravar.
//
//   GET    /        → lista todos os registros
//   GET    /:id     → busca um registro pelo id
//   POST   /        → cria um registro
//   PUT    /:id     → atualiza um registro
//   DELETE /:id     → remove um registro
//
// `options.removeConflict(id)` (opcional) devolve uma mensagem quando o
// registro não pode ser removido (ex.: pet com adoção vinculada) → 409.
// ─────────────────────────────────────────────────────────────────────────
export function crudRouter(collection, validate = (data) => ({ value: data }), options = {}) {
  const router = Router() // Cria um novo roteador isolado

  //Retorna todos os itens da coleção
  router.get('/', (_req, res) => {
    res.json(db.list(collection))
  })

  //Retorna apenas um ID específico
  router.get('/:id', (req, res) => {
    const item = db.getById(collection, req.params.id)
    if (!item) return res.status(404).json({ error: 'Registro não encontrado.' })
    res.json(item)
  })

  //Adiciona um novo registro no banco de dados
  router.post('/', (req, res) => {
    const { value, error } = validate(req.body)
    if (error) return res.status(400).json({ error })
    res.status(201).json(db.create(collection, value))
  })

  //Atualiza um registro existente
  router.put('/:id', (req, res) => {
    const { value, error } = validate(req.body, { partial: true })
    if (error) return res.status(400).json({ error })
    const updated = db.update(collection, req.params.id, value)
    if (!updated) return res.status(404).json({ error: 'Registro não encontrado.' })
    res.json(updated)
  })

  //Remove um registro do banco pelo ID
  router.delete('/:id', (req, res) => {
    const conflict = options.removeConflict?.(req.params.id)
    if (conflict) return res.status(409).json({ error: conflict })
    const ok = db.remove(collection, req.params.id)
    if (!ok) return res.status(404).json({ error: 'Registro não encontrado.' })
    res.status(204).end()
  })

  return router
}
