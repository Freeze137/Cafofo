import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ─────────────────────────────────────────────────────────────────────────
// Rota protegida — bloqueia o acesso às telas de CRUD sem login.
// Redireciona para /login preservando a rota de origem.
// ─────────────────────────────────────────────────────────────────────────
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // ── Enquanto checa a sessão: mostra um spinner ──
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      </div>
    )
  }

  // ── Sem login: redireciona guardando a rota de origem ──
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // ── Logado: libera o conteúdo protegido ───────
  return children
}
