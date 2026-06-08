import * as local from './localDriver'

// ─────────────────────────────────────────────────────────────────────────
// Serviço de PRODUTOS (CRUD 2)
//
// Gerencia o catálogo da lojinha do pet shop. É um CRUD "global" (não é
// filtrado por usuário) para demonstrar uma entidade independente.
// ─────────────────────────────────────────────────────────────────────────

const COLLECTION = 'products'

export const listProducts = () => local.list(COLLECTION)
export const createProduct = (data) => local.create(COLLECTION, data)
export const updateProduct = (id, data) => local.update(COLLECTION, id, data)
export const deleteProduct = (id) => local.remove(COLLECTION, id)
