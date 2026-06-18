import { API_URL } from './config'

// ─────────────────────────────────────────────────────────────────────────
// Cliente HTTP da API REST de adoção
//
// Camada fina sobre o fetch que centraliza a URL base, o parsing de JSON e
// o tratamento de erros. Os serviços por entidade (petService, etc.) usam
// estas funções e nunca falam com o fetch diretamente.
// ─────────────────────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // 204 No Content (ex.: DELETE) não tem corpo para parsear.
  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.error || 'Erro ao comunicar com o servidor.')
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}

// ─────────────────────────────────────────────────────────────────────────
// Fábrica de serviço CRUD: gera as quatro operações para uma coleção REST,
// evitando repetir o mesmo boilerplate em cada entidade.
// ─────────────────────────────────────────────────────────────────────────
export function crudService(resource) {
  return {
    list: () => api.get(`/${resource}`),
    get: (id) => api.get(`/${resource}/${id}`),
    create: (data) => api.post(`/${resource}`, data),
    update: (id, data) => api.put(`/${resource}/${id}`, data),
    remove: (id) => api.del(`/${resource}/${id}`),
  }
}
