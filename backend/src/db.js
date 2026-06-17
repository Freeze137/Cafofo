import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { SEED } from './data/seed.js'

// ─────────────────────────────────────────────────────────────────────────
// Camada de persistência (banco de dados)
//
// "Banco" simples baseado em um único arquivo JSON (db.json) na raiz do
// backend. Implementa um CRUD genérico sobre coleções nomeadas, mantendo a
// API agnóstica de qual SGBD está por trás. Trocar por SQLite/Postgres mais
// tarde exige reimplementar apenas estas funções, sem tocar nas rotas.
// ─────────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_FILE = join(__dirname, '..', 'db.json')

// ── 1. Leitura / escrita do arquivo ──────────────────────────────────────

/** Carrega o banco do disco; semeia com dados de demonstração se não existir. */
function readDb() {
  if (!existsSync(DB_FILE)) {
    writeFileSync(DB_FILE, JSON.stringify(SEED, null, 2))
    return structuredClone(SEED)
  }
  try {
    return JSON.parse(readFileSync(DB_FILE, 'utf-8'))
  } catch {
    // Arquivo corrompido: recria a partir do seed para não derrubar a API.
    writeFileSync(DB_FILE, JSON.stringify(SEED, null, 2))
    return structuredClone(SEED)
  }
}

/** Persiste o banco inteiro no disco. */
function writeDb(db) {
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

// ── 2. Utilitário ────────────────────────────────────────────────────────

/** Gera um identificador único simples (timestamp + aleatório). */
export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

// ── 3. Operações genéricas de CRUD ───────────────────────────────────────

/** READ — lista todos os documentos de uma coleção. */
export function list(collection) {
  return readDb()[collection] ?? []
}

/** READ — busca um único documento pelo id. */
export function getById(collection, id) {
  return list(collection).find((item) => item.id === id) ?? null
}

/** CREATE — insere um novo documento e retorna o registro criado. */
export function create(collection, data) {
  const db = readDb()
  const doc = { id: uid(), createdAt: new Date().toISOString(), ...data }
  db[collection] = [...(db[collection] ?? []), doc]
  writeDb(db)
  return doc
}

/** UPDATE — atualiza parcialmente um documento existente. */
export function update(collection, id, data) {
  const db = readDb()
  const items = db[collection] ?? []
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() }
  db[collection] = items
  writeDb(db)
  return items[index]
}

/** DELETE — remove um documento pelo id. Retorna true se algo foi removido. */
export function remove(collection, id) {
  const db = readDb()
  const items = db[collection] ?? []
  const next = items.filter((item) => item.id !== id)
  db[collection] = next
  writeDb(db)
  return next.length !== items.length
}
