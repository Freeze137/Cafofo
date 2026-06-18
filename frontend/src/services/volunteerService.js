import { crudService } from './api'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de VOLUNTÁRIOS (CRUD 3) — consome /api/volunteers do backend.
// ─────────────────────────────────────────────────────────────────────────
// Gera as funções de comunicação com a API para voluntarios
const volunteers = crudService('volunteers')

// Exporta as operações básicas para as telas do React (Frontend) poderem usar
export const listVolunteers = () => volunteers.list()
export const createVolunteer = (data) => volunteers.create(data)
export const updateVolunteer = (id, data) => volunteers.update(id, data)
export const deleteVolunteer = (id) => volunteers.remove(id)
