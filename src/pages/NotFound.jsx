import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'

// ── Página 404 (rota não encontrada) ──────────
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <PawPrint className="animate-float text-brand-300" size={90} />
      <h1 className="mt-6 text-6xl font-extrabold text-brand-600">404</h1>
      <p className="mt-2 text-xl font-semibold text-slate-700">Ops! Página não encontrada.</p>
      <p className="mt-1 text-slate-500">Esse cafofo não existe por aqui. 🐾</p>
      <Link to="/" className="btn-primary mt-8">
        Voltar para o início
      </Link>
    </div>
  )
}
