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

// ── 1. Operações Exportadas ──────────────────────────────────────────────
/** Lista os pets de um usuário (filtro por dono). */

/** 
 * Lista os pets de um usuário específico.
 * @param {string} ownerId - O ID do tutor do pet (usuário logado).
 * @returns {Promise<Array>} Retorna um array com os pets cadastrados.
 */
export const listPets = (ownerId) => local.list(COLLECTION, { ownerId })

/** Cria um novo pet para o usuário. */
/** 
 * Cadastra um novo pet no banco de dados vinculando-o ao usuário logado.
 * @param {string} ownerId - O ID do tutor do pet (usuário logado).
 * @param {Object} data - Os dados preenchidos no formulário (nome, especie, etc).
 * @returns {Promise<Object>} O registro do pet recém-criado, incluindo o ID único gerado.
 */
export const createPet = (ownerId, data) =>
  local.create(COLLECTION, { ownerId, ...data })

/** Atualiza os dados de um pet. */
/** 
 * Atualiza as informações de um pet já existente.
 * @param {string} id - O ID único do pet.
 * @param {Object} data - Objeto contendo APENAS as propriedades que devem ser alteradas.
 * @returns {Promise<Object>} O registro do pet atualizado.
 */
export const updatePet = (id, data) => local.update(COLLECTION, id, data)

/** Remove um pet. */
/** 
 * Exclui um pet de forma irreversível.
 * @param {string} id - O ID único do pet.
 * @returns {Promise<boolean>} Retorna true caso a remoção seja bem-sucedida.
 */
export const deletePet = (id) => local.remove(COLLECTION, id)
