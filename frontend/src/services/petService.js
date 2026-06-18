import { crudService } from './api'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de PETS (CRUD 1) — consome /api/pets do backend.
// ─────────────────────────────────────────────────────────────────────────
// Gera as funções de comunicação com a API para pets
const pets = crudService('pets')

// Exporta as operações básicas para as telas do React (Frontend) poderem usar
export const listPets = () => pets.list()
export const createPet = (data) => pets.create(data)
export const updatePet = (id, data) => pets.update(id, data)
export const deletePet = (id) => pets.remove(id)
