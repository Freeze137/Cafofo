import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_PREFIX } from '../services/config'
import { api, UNAUTHORIZED_EVENT } from '../services/api'

// ─────────────────────────────────────────────────────────────────────────
// AuthContext — Gerenciamento de Estado da Sessão
//
// Fornece login, cadastro, logout e o usuário atual para toda a aplicação
// via Context API. Cadastro e login acontecem na API (/api/auth), que guarda
// apenas o hash bcrypt da senha. O navegador guarda só o token de sessão
// (JWT) e os dados públicos do usuário — nunca a senha.
// ─────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

// ── 1. Chaves do localStorage ────────────────────────────────────────────
const SESSION_KEY = `${STORAGE_PREFIX}:session`
// Versões antigas guardavam a lista de usuários COM SENHA em texto puro
// nesta chave. Ela é apagada ao abrir o app (migração da issue #9).
const LEGACY_USERS_KEY = `${STORAGE_PREFIX}:users`

function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY))
    return saved?.token && saved?.user ? saved : null
  } catch {
    return null
  }
}

// ── 2. Provider de Autenticação ──────────────────────────────────────────
export function AuthProvider({ children }) {
  // 2.1 Estados
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 2.2 Inicialização: remove dados legados e restaura a sessão, conferindo
  // na API se o token ainda é válido.
  useEffect(() => {
    localStorage.removeItem(LEGACY_USERS_KEY)
    const saved = readSession()
    if (!saved) {
      setLoading(false)
      return
    }
    api
      .get('/auth/me')
      .then((me) => setUser(me))
      .catch(() => localStorage.removeItem(SESSION_KEY))
      .finally(() => setLoading(false))
  }, [])

  // 2.3 Sessão recusada pela API (token expirado/inválido) → volta ao login.
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  // 2.4 Handlers de Autenticação
  /** Persiste a sessão (token + dados públicos do usuário). */
  const persistSession = ({ token, user: u }) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: u }))
    setUser(u)
    return u
  }

  /** Login com e-mail e senha (validado na API). */
  const login = async (email, senha) => persistSession(await api.post('/auth/login', { email, senha }))

  /** Cadastro de novo usuário (a API grava só o hash da senha). */
  const register = async (nome, email, senha) =>
    persistSession(await api.post('/auth/register', { nome, email, senha }))

  /** Login com Google: ainda não integrado (D8). Não cria sessão falsa. */
  const loginWithGoogle = async () => {
    throw new Error('Login com Google ainda não está disponível. Entre com e-mail e senha.')
  }

  /** Encerra a sessão. */
  const logout = async () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  // As funções (login/register/etc.) são estáveis durante o ciclo de vida do
  // provider, então memorizamos apenas em função de `user` e `loading`.
  const value = useMemo(
    () => ({ user, loading, login, register, loginWithGoogle, logout, isAuthenticated: !!user }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading],
  )

  // 2.5 Renderização do Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── 3. Hook Customizado ──────────────────────────────────────────────────
/** Hook de acesso ao contexto de autenticação. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
