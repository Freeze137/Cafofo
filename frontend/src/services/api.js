import { API_URL, STORAGE_PREFIX } from './config'

// ─────────────────────────────────────────────────────────────────────────
// Cliente HTTP da API REST de adoção
// ─────────────────────────────────────────────────────────────────────────

// Token de sessão (JWT) salvo pelo AuthContext após login/cadastro.
function authHeader() {
  try {
    const token = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}:session`))?.token
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
