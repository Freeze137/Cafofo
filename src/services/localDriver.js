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
  // Mistura a data/hora atual (base 36) com uma string aleatória para simular um ID de banco.
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** Lê toda a coleção do localStorage. */
function readAll(collection) {
  try {
    const raw = localStorage.getItem(key(collection))
    // Retorna os dados como array. Se for nulo/vazio, retorna um array vazio como fallback.
    return raw ? JSON.parse(raw) : []
  } catch {
    // Se der erro no parse (ex: JSON corrompido no navegador), evita que a aplicação inteira quebre.
    return []
  }
}

/** Persiste a coleção inteira no localStorage. */
function writeAll(collection, items) {
  // Como o localStorage só aceita strings, transformamos o array de objetos em JSON.
  localStorage.setItem(key(collection), JSON.stringify(items))
}

// ── 2. Operações do CRUD ────────────────────────────────────────────────────

/** READ — lista todos os documentos, opcionalmente filtrando por campo. */
export async function list(collection, filter = {}) {
  const items = readAll(collection)
  const entries = Object.entries(filter)
  
  // Se nenhum filtro foi passado (ex: listando produtos globais), retorna tudo.
  if (entries.length === 0) return items
  
  // Retorna apenas os itens que correspondem a todas as chaves do filtro (ex: ownerId).
  return items.filter((item) =>
    entries.every(([field, value]) => item[field] === value),
  )
}

/** READ — busca um único documento por id. */
export async function getById(collection, id) {
  // Usa o ?? (nullish coalescing) para retornar explicitamente null caso o find não ache nada.
  return readAll(collection).find((item) => item.id === id) ?? null
}

/** CREATE — insere um novo documento e retorna o registro criado. */
export async function create(collection, data) {
  const items = readAll(collection)
  // Injeta no novo documento um ID único e a data/hora exata da criação.
  const doc = { id: uid(), createdAt: new Date().toISOString(), ...data }
  items.push(doc)
  writeAll(collection, items)
  return doc
}

/** UPDATE — atualiza parcialmente um documento existente. */
export async function update(collection, id, data) {
  const items = readAll(collection)
  const index = items.findIndex((item) => item.id === id)
  
  // Validação de segurança: previne a tentativa de atualizar algo que não existe.
  if (index === -1) throw new Error('Registro não encontrado')
  
  // Mescla os dados antigos com as novas alterações (...data) e atualiza o timestamp de updatedAt.
  items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() }
  writeAll(collection, items)
  return items[index]
}

/** DELETE — remove um documento pelo id. */
export async function remove(collection, id) {
  // Cria um novo array excluindo apenas o item que tem o ID informado.
  const items = readAll(collection).filter((item) => item.id !== id)
  writeAll(collection, items)
  return true
}

// ── 3. Operações de Seed ─────────────────────────────────────────────────

/** Semeia a coleção apenas se ela ainda não existir (primeira execução). */
export function seedIfEmpty(collection, items) {
  // Executado na montagem do App. Verifica se o Storage está vazio antes de jogar os dados de demonstração.
  if (localStorage.getItem(key(collection)) === null) {
    writeAll(collection, items)
  }
}
