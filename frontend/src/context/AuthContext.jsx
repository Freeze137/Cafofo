import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_PREFIX } from '../services/config'

// ─────────────────────────────────────────────────────────────────────────
// AuthContext — Gerenciamento de Estado da Sessão
//
// Fornece login, cadastro, logout e o usuário atual para toda a aplicação
// via Context API. A sessão é persistida no localStorage.
// ─────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

// ── 1. Configurações e Mock ──────────────────────────────────────────────
const SESSION_KEY = `${STORAGE_PREFIX}:session`
const USERS_KEY = `${STORAGE_PREFIX}:users`

// Usuário demonstração disponível já no primeiro acesso.
const DEMO_USER = {
  id: 'user-demo',
  nome: 'Cliente Demo',
  email: 'demo@cafofopeludos.com',
  senha: '123456',
  photoURL: null,
}

// ── 2. Helpers (Modo Local) ──────────────────────────────────────────────
// Funções auxiliares para ler e escrever a lista de usuários no localStorage.
function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const users = raw ? JSON.parse(raw) : []
    // Garante que o usuário demo sempre exista.
    if (!users.some((u) => u.email === DEMO_USER.email)) users.push(DEMO_USER)
    return users
  } catch {
    return [DEMO_USER]
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// ── 3. Provider de Autenticação ──────────────────────────────────────────
export function AuthProvider({ children }) {
  // 3.1 Estados
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 3.2 Efeito de Inicialização (Restauração de Sessão)
  // Executado apenas uma vez quando o app abre. Lê a sessão salva
  // no localStorage, se houver.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {
      /* ignora sessão corrompida */
    }
    setLoading(false)
  }, [])

  // 3.3 Handlers de Autenticação
  /** Persiste a sessão local. */
  const persistSession = (u) => {
    setUser(u)
    localStorage.setItem(SESSION_KEY, JSON.stringify(u))
  }

  /** Login com e-mail e senha. */
  const login = async (email, senha) => {
    const found = readUsers().find(
      (u) => u.email === email.trim().toLowerCase() && u.senha === senha,
    )
    if (!found) throw new Error('E-mail ou senha inválidos.')
    const { senha: _omit, ...safe } = found
    persistSession(safe)
    return safe
  }

  /** Cadastro de novo usuário. */
  const register = async (nome, email, senha) => {
    const users = readUsers()
    const normalized = email.trim().toLowerCase()
    if (users.some((u) => u.email === normalized))
      throw new Error('Este e-mail já está cadastrado.')
    const newUser = { id: `user-${Date.now()}`, nome, email: normalized, senha, photoURL: null }
    writeUsers([...users, newUser])
    const { senha: _omit, ...safe } = newUser
    persistSession(safe)
    return safe
  }

  /** Login com Google (demonstração no modo local). */
  const loginWithGoogle = async () => {
    persistSession({
      id: 'user-google-demo',
      nome: 'Usuário Google',
      email: 'google@cafofopeludos.com',
      photoURL: null,
    })
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

  // 3.4 Renderização do Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── 4. Hook Customizado ──────────────────────────────────────────────────
/** Hook de acesso ao contexto de autenticação. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
