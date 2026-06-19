import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { SEED } from './data/seed.js'

// ─────────────────────────────────────────────────────────────────────────
// Persistência local em arquivo JSON (sem servidor de banco)
//
// Substitui o antigo driver MySQL: os dados ficam num único arquivo
// (src/data/db.json) lido na memória ao iniciar e regravado a cada
// mudança. O app roda apenas com `npm run dev` no backend — nenhum MySQL,
// nenhuma credencial.
//
// As funções são SÍNCRONAS de propósito: as rotas (crudRouter, adoptions)
// chamam db.list/getById/create/update/remove sem await.
// ─────────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DB_FILE = join(DATA_DIR, 'db.json')

// Carrega o banco do disco. Na primeira execução (arquivo inexistente),
// popula com os dados iniciais do seed e grava.
function load() {
  if (existsSync(DB_FILE)) {
    try {
      return JSON.parse(readFileSync(DB_FILE, 'utf-8'))
    } catch {
      // Arquivo corrompido: recomeça do seed.
    }
  }
  const initial = {
    pets: SEED.pets ?? [],
    volunteers: SEED.volunteers ?? [],
    adoptions: SEED.adoptions ?? [],
  }
  persist(initial)
  return initial
}

// Grava o estado completo no arquivo JSON.
function persist(state) {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(DB_FILE, JSON.stringify(state, null, 2))
}

const store = load()

// Garante que a coleção exista e devolve sua lista (referência viva).
function collection(name) {
  if (!store[name]) store[name] = []
  return store[name]
}

// Gera um id único e estável (timestamp + contador, evita colisão).
let counter = 0
function genId(name) {
  return `${name}-${Date.now().toString(36)}-${(counter++).toString(36)}`
}

// Busca todos os registros de uma coleção.
export function list(name) {
  return collection(name)
}

// Busca apenas um registro pelo id (null se não achar).
export function getById(name, id) {
  return collection(name).find((row) => String(row.id) === String(id)) ?? null
}

// Insere um novo registro e devolve com o id gerado.
export function create(name, data) {
  const row = { id: genId(name), ...data }
  collection(name).push(row)
  persist(store)
  return row
}

// Atualiza parcialmente um registro pelo id (null se não achar).
export function update(name, id, data) {
  const rows = collection(name)
  const index = rows.findIndex((row) => String(row.id) === String(id))
  if (index === -1) return null
  rows[index] = { ...rows[index], ...data }
  persist(store)
  return rows[index]
}

// Apaga um registro pelo id (false se não achar).
export function remove(name, id) {
  const rows = collection(name)
  const index = rows.findIndex((row) => String(row.id) === String(id))
  if (index === -1) return false
  rows.splice(index, 1)
  persist(store)
  return true
}
