import { crudService } from './api'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de VOLUNTÁRIOS (CRUD 3) — consome /api/volunteers do backend.
// ─────────────────────────────────────────────────────────────────────────
const volunteers = crudService('volunteers')

export const listVolunteers = () => volunteers.list()
export const createVolunteer = (data) => volunteers.create(data)
export const updateVolunteer = (id, data) => volunteers.update(id, data)
export const deleteVolunteer = (id) => volunteers.remove(id)
