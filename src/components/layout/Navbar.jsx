import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Navbar pública da landing page — responsiva (menu hamburguer no mobile).
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const links = [
    { label: 'Serviços', href: '#servicos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Depoimentos', href: '#depoimentos' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-brand-100/60 bg-cream/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-brand-700">
          <span className="rounded-xl bg-brand-500 p-2 text-white shadow-soft">
            <PawPrint size={22} />
          </span>
          CAFOFO<span className="text-brand-400">PELUDOS</span>
        </Link>

        {/* Links desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-medium text-slate-600 transition hover:text-brand-600"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Ações desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/app" className="btn-ghost py-2">
                <LayoutDashboard size={18} /> Painel
              </Link>
              <button onClick={handleLogout} className="btn-primary py-2">
                <LogOut size={18} /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost py-2">
                Entrar
              </Link>
              <Link to="/register" className="btn-primary py-2">
                Cadastrar
              </Link>
            </>
          )}
        </div>

        {/* Botão mobile */}
        <button
          className="rounded-lg p-2 text-brand-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden border-t border-brand-100 bg-cream px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-medium text-slate-600"
              >
                {l.label}
              </a>
            ))}
            <hr className="border-brand-100" />
            {isAuthenticated ? (
              <>
                <Link to="/app" className="btn-ghost" onClick={() => setOpen(false)}>
                  Painel
                </Link>
                <button onClick={handleLogout} className="btn-primary">
                  Sair ({user?.nome?.split(' ')[0]})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
