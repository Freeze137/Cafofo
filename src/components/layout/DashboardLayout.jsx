import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PawPrint,
  LayoutDashboard,
  Dog,
  CalendarDays,
  ShoppingBag,
  BarChart3,
  LogOut,
  Menu,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Itens de navegação da área logada.
const NAV = [
  { to: '/app', label: 'Visão geral', icon: LayoutDashboard, end: true },
  { to: '/app/pets', label: 'Meus Pets', icon: Dog },
  { to: '/app/agendamentos', label: 'Agendamentos', icon: CalendarDays },
  { to: '/app/produtos', label: 'Produtos', icon: ShoppingBag },
  { to: '/app/relatorio', label: 'Relatório', icon: BarChart3 },
]

// Layout com sidebar para o dashboard do cliente.
export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-6 text-lg font-extrabold text-brand-700"
      >
        <span className="rounded-xl bg-brand-500 p-2 text-white shadow-soft">
          <PawPrint size={20} />
        </span>
        CAFOFOPELUDOS
      </Link>

      <nav className="flex-1 space-y-1 px-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                isActive
                  ? 'bg-brand-500 text-white shadow-soft'
                  : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'
              }`
            }
          >
            <Icon size={20} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-bold text-white">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-700">{user?.nome}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-4 py-2.5 font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-100 bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile (drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <Menu className="text-brand-700" />
          </button>
          <span className="font-extrabold text-brand-700">CAFOFOPELUDOS</span>
          <span className="w-6" />
        </header>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
