import * as local from './localDriver'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de AGENDAMENTOS (CRUD 3)
//
// Cada agendamento referencia um pet (petId) e um serviço (serviceId) —
// chaves estrangeiras simuladas usadas no relatório com JOIN.
// ─────────────────────────────────────────────────────────────────────────

const COLLECTION = 'appointments'

export const listAppointments = (ownerId) => local.list(COLLECTION, { ownerId })
export const createAppointment = (ownerId, data) =>
  local.create(COLLECTION, { ownerId, status: 'Pendente', ...data })
export const updateAppointment = (id, data) => local.update(COLLECTION, id, data)
export const deleteAppointment = (id) => local.remove(COLLECTION, id)
