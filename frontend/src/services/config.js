// ─────────────────────────────────────────────────────────────────────────
// Estratégia de persistência
//
// O backend de dados é local (localStorage) no frontend, consumindo a API
// REST do Express. Não há mais integração com Firebase.
// ─────────────────────────────────────────────────────────────────────────

// Prefixo das chaves no localStorage (usado pela autenticação local).
export const STORAGE_PREFIX = 'cafofopeludos'

// URL base da API REST de adoção (backend Express).
// Configurável via .env (VITE_API_URL); por padrão aponta para o backend local.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'
