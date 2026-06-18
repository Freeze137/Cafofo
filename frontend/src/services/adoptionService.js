import { api, crudService } from './api'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de ADOÇÕES (CRUD 2) — consome /api/adoptions do backend.
// ─────────────────────────────────────────────────────────────────────────
// Gera as funções de comunicação com a API para adoções
const adoptions = crudService('adoptions')

// Exporta as operações básicas para as telas do React poderem usar
export const listAdoptions = () => adoptions.list()
export const createAdoption = (data) => adoptions.create(data)
export const updateAdoption = (id, data) => adoptions.update(id, data)
export const deleteAdoption = (id) => adoptions.remove(id)

// Rota especial: busca o relatório onde o Backend já juntou
export const reportAdoptions = () => api.get('/adoptions/report')
