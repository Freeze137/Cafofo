import * as local from './localDriver'

// ─────────────────────────────────────────────────────────────────────────
// Catálogo de SERVIÇOS (entidade de apoio para o JOIN)
//
// Banho, tosa, hotelzinho, etc. Usado nos selects de agendamento e como
// uma das tabelas do relatório com JOIN.
// ─────────────────────────────────────────────────────────────────────────

const COLLECTION = 'services'

export const listServices = () => local.list(COLLECTION)
export const getService = (id) => local.getById(COLLECTION, id)
