import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { USE_FIREBASE, STORAGE_PREFIX } from '../services/config'
import { auth, googleProvider } from '../firebase/firebase'

// ─────────────────────────────────────────────────────────────────────────
// AuthContext (Passo 3 da entrega) — Gerenciamento de estado da sessão
//
// Fornece login, cadastro, logout e o usuário atual para toda a aplicação
// via Context API. Suporta dois modos:
//   • LOCAL (padrão): autenticação simulada persistida em localStorage,
//     permitindo manter a sessão e bloquear rotas sem nenhum backend.
//   • FIREBASE: usa Firebase Authentication (Email/Senha + Google) quando
//     há credenciais configuradas em .env.
// ─────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)
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

/* ----------------------- Helpers do modo LOCAL ----------------------- */
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restaura a sessão ao carregar o app (mantém o usuário logado).
  useEffect(() => {
    if (USE_FIREBASE) {
      // No modo Firebase, escuta as mudanças de autenticação.
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        const unsub = onAuthStateChanged(auth, (fbUser) => {
          setUser(
            fbUser
              ? {
                  id: fbUser.uid,
                  nome: fbUser.displayName || fbUser.email,
                  email: fbUser.email,
                  photoURL: fbUser.photoURL,
                }
              : null,
          )
          setLoading(false)
        })
        return unsub
      })
      return
    }

    // Modo local: lê a sessão salva.
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {
      /* ignora sessão corrompida */
    }
    setLoading(false)
  }, [])

  /** Persiste a sessão local. */
  const persistSession = (u) => {
    setUser(u)
    localStorage.setItem(SESSION_KEY, JSON.stringify(u))
  }

  /** Login com e-mail e senha. */
  const login = async (email, senha) => {
    if (USE_FIREBASE) {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const cred = await signInWithEmailAndPassword(auth, email, senha)
      return cred.user
    }
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
    if (USE_FIREBASE) {
      const { createUserWithEmailAndPassword, updateProfile } = await import(
        'firebase/auth'
      )
      const cred = await createUserWithEmailAndPassword(auth, email, senha)
      await updateProfile(cred.user, { displayName: nome })
      return cred.user
    }
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

  /** Login com Google (apenas modo Firebase). */
  const loginWithGoogle = async () => {
    if (!USE_FIREBASE) {
      // Fallback de demonstração no modo local.
      persistSession({
        id: 'user-google-demo',
        nome: 'Usuário Google',
        email: 'google@cafofopeludos.com',
        photoURL: null,
      })
      return
    }
    const { signInWithPopup } = await import('firebase/auth')
    await signInWithPopup(auth, googleProvider)
  }

  /** Encerra a sessão. */
  const logout = async () => {
    if (USE_FIREBASE) {
      const { signOut } = await import('firebase/auth')
      await signOut(auth)
    } else {
      localStorage.removeItem(SESSION_KEY)
      setUser(null)
    }
  }

  // As funções (login/register/etc.) são estáveis durante o ciclo de vida do
  // provider, então memorizamos apenas em função de `user` e `loading`.
  const value = useMemo(
    () => ({ user, loading, login, register, loginWithGoogle, logout, isAuthenticated: !!user }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook de acesso ao contexto de autenticação. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
