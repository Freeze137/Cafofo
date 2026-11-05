// ─────────────────────────────────────────────────────────────────────────
// Estratégia de persistência
//
// Os dados e as contas ficam na API REST do Express (backend). O navegador
// guarda só a sessão (token JWT) no localStorage.
// ─────────────────────────────────────────────────────────────────────────

// Prefixo das chaves no localStorage (sessão de login).
export const STORAGE_PREFIX = 'cafofopeludos'

// URL base da API REST de adoção (backend Express).
// Configurável via .env (VITE_API_URL); por padrão aponta para o backend local.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'
