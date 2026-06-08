import * as local from './localDriver'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de PETS (CRUD 1)
//
// Encapsula todas as chamadas de banco relacionadas aos pets do usuário.
// Os componentes nunca acessam o driver diretamente — sempre passam por aqui.
// (Para usar Firestore, basta reimplementar estas funções com a SDK do
//  Firebase; a assinatura permanece a mesma.)
// ─────────────────────────────────────────────────────────────────────────

const COLLECTION = 'pets'

/** Lista os pets de um usuário (filtro por dono). */
export const listPets = (ownerId) => local.list(COLLECTION, { ownerId })

/** Cria um novo pet para o usuário. */
export const createPet = (ownerId, data) =>
  local.create(COLLECTION, { ownerId, ...data })

/** Atualiza os dados de um pet. */
export const updatePet = (id, data) => local.update(COLLECTION, id, data)

/** Remove um pet. */
export const deletePet = (id) => local.remove(COLLECTION, id)
