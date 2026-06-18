import { api, crudService } from './api'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de ADOÇÕES (CRUD 2) — consome /api/adoptions do backend.
//
// Expõe também `reportAdoptions`, que retorna as adoções já cruzadas (JOIN)
// com pets e voluntários, calculado no servidor.
// ─────────────────────────────────────────────────────────────────────────
const adoptions = crudService('adoptions')

export const listAdoptions = () => adoptions.list()
export const createAdoption = (data) => adoptions.create(data)
export const updateAdoption = (id, data) => adoptions.update(id, data)
export const deleteAdoption = (id) => adoptions.remove(id)

export const reportAdoptions = () => api.get('/adoptions/report')
