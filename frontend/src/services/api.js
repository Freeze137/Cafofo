import { API_URL, STORAGE_PREFIX } from './config'

// ─────────────────────────────────────────────────────────────────────────
// Cliente HTTP da API REST de adoção
// ─────────────────────────────────────────────────────────────────────────

const SESSION_KEY = `${STORAGE_PREFIX}:session`

// Evento disparado quando a API recusa o token (401): o AuthContext encerra
// a sessão e o ProtectedRoute leva o usuário de volta ao login.
export const UNAUTHORIZED_EVENT = 'cafofo:unauthorized'

// Token de sessão (JWT) salvo pelo AuthContext após login/cadastro.
function authHeader() {
  try {
    const token = JSON.parse(localStorage.getItem(SESSION_KEY))?.token
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

//Faz a ponte entre o Frontend e o Backend usando 'fetch'
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    ...options,
  })

  //(ex: excluiu com sucesso), retorna nulo pois não tem texto para ler
  if (res.status === 204) return null

  // Tenta ler a resposta do servidor
  const data = await res.json().catch(() => null)

  // Sessão ausente/expirada numa rota protegida: encerra a sessão local.
  // (Em /auth/login o 401 significa só "senha errada" e é tratado na tela.)
  if (res.status === 401 && !path.startsWith('/auth/login')) {
    localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }

  //lança esse erro para o React mostrar na tela
  if (!res.ok) {
    throw new Error(data?.error || 'Erro ao comunicar com o servidor.')
  }
  return data
}

//atalhos fáceis para não digitar asconfigurações do 'fetch' toda hora
export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }), // trasforma em json
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}

// ─────────────────────────────────────────────────────────────────────────
// Fábrica de serviço CRUD
// ─────────────────────────────────────────────────────────────────────────

// Assim como fizemos no Backend, essa cria as 5 funções
// (listar, buscar, criar, atualizar e deletar) para qualquer entidade
export function crudService(resource) {
  return {
    list: () => api.get(`/${resource}`),
    get: (id) => api.get(`/${resource}/${id}`),
    create: (data) => api.post(`/${resource}`, data),
    update: (id, data) => api.put(`/${resource}/${id}`, data),
    remove: (id) => api.del(`/${resource}/${id}`),
  }
}
