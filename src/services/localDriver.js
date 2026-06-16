import { STORAGE_PREFIX } from './config'

// ─────────────────────────────────────────────────────────────────────────
// Driver de persistência local (localStorage)
//
// Implementa um CRUD genérico sobre uma "coleção" nomeada, simulando o
// comportamento do Firestore. Cada documento recebe um `id` único.
// Todas as funções são assíncronas (retornam Promise) para que a troca
// pelo driver do Firebase seja transparente para a camada de serviços.
// ─────────────────────────────────────────────────────────────────────────

const key = (collection) => `${STORAGE_PREFIX}:${collection}`

// ── 1. Utilitários e Helpers ─────────────────────────────────────────────

/** Gera um identificador único simples. */
export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** Lê toda a coleção do localStorage. */
function readAll(collection) {
  try {
    const raw = localStorage.getItem(key(collection))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Persiste a coleção inteira no localStorage. */
function writeAll(collection, items) {
  localStorage.setItem(key(collection), JSON.stringify(items))
}

// ── 2. Operações CRUD ────────────────────────────────────────────────────

/** READ — lista todos os documentos, opcionalmente filtrando por campo. */
export async function list(collection, filter = {}) {
  const items = readAll(collection)
  const entries = Object.entries(filter)
  if (entries.length === 0) return items
  return items.filter((item) =>
    entries.every(([field, value]) => item[field] === value),
  )
}

/** READ — busca um único documento por id. */
export async function getById(collection, id) {
  return readAll(collection).find((item) => item.id === id) ?? null
}

/** CREATE — insere um novo documento e retorna o registro criado. */
export async function create(collection, data) {
  const items = readAll(collection)
  const doc = { id: uid(), createdAt: new Date().toISOString(), ...data }
  items.push(doc)
  writeAll(collection, items)
  return doc
}

/** UPDATE — atualiza parcialmente um documento existente. */
export async function update(collection, id, data) {
  const items = readAll(collection)
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Registro não encontrado')
  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() }
  writeAll(collection, items)
  return items[index]
}

/** DELETE — remove um documento pelo id. */
export async function remove(collection, id) {
  const items = readAll(collection).filter((item) => item.id !== id)
  writeAll(collection, items)
  return true
}

// ── 3. Operações de Seed ─────────────────────────────────────────────────

/** Semeia a coleção apenas se ela ainda não existir (primeira execução). */
export function seedIfEmpty(collection, items) {
  if (localStorage.getItem(key(collection)) === null) {
    writeAll(collection, items)
  }
}
