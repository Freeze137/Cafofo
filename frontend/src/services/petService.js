import { crudService } from './api'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de PETS (CRUD 1) — consome /api/pets do backend.
// ─────────────────────────────────────────────────────────────────────────
const pets = crudService('pets')

export const listPets = () => pets.list()
export const createPet = (data) => pets.create(data)
export const updatePet = (id, data) => pets.update(id, data)
export const deletePet = (id) => pets.remove(id)
