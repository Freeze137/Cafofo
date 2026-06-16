import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dog, CalendarDays, ShoppingBag, ArrowRight, PawPrint } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { listPets } from '../services/petService'
import { listAppointments } from '../services/appointmentService'
import { listProducts } from '../services/productService'
import PageHeader from '../components/ui/PageHeader'

// ─────────────────────────────────────────────────────────────────────────
// Visão Geral (Dashboard)
//
// Página inicial após o login. Apresenta um resumo da conta do usuário
// através de indicadores chave de performance (KPIs) e atalhos rápidos.
// ─────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  // ── 1. Estados e Efeitos ───────────────────────────────────────────────
  const { user } = useAuth()
  const [stats, setStats] = useState({ pets: 0, appointments: 0, products: 0 })

  useEffect(() => {
    // Carrega as contagens de cada coleção em paralelo para otimizar o carregamento.
    Promise.all([
      listPets(user.id),
      listAppointments(user.id),
      listProducts(),
    ]).then(([pets, appointments, products]) => {
      setStats({
        pets: pets.length,
        appointments: appointments.length,
        products: products.length,
      })
    })
  }, [user.id])

  // ── 2. Configurações de UI ─────────────────────────────────────────────
  // Array para gerar os cards dinamicamente, evitando repetição de código no JSX.
  const cards = [
    { to: '/app/pets', label: 'Meus Pets', value: stats.pets, icon: Dog, color: 'from-brand-400 to-brand-600' },
    { to: '/app/agendamentos', label: 'Agendamentos', value: stats.appointments, icon: CalendarDays, color: 'from-sky-400 to-sky-600' },
    { to: '/app/produtos', label: 'Produtos', value: stats.products, icon: ShoppingBag, color: 'from-emerald-400 to-emerald-600' },
  ]

  // ── 3. Renderização ────────────────────────────────────────────────────
  return (
    <div>
      {/* Cabeçalho de Boas-Vindas */}
      <PageHeader
        title={`Olá, ${user.nome?.split(' ')[0]}! 👋`}
        description="Aqui está um resumo da sua conta no CAFOFOPELUDOS."
      />

      {/* Grid de Métricas (KPIs) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={c.to}
              className="card group flex items-center justify-between hover:shadow-soft"
            >
              <div>
                <p className="text-sm font-medium text-slate-500">{c.label}</p>
                <p className="mt-1 text-4xl font-extrabold text-slate-900">{c.value}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Ver tudo <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </span>
              </div>
              <div className={`rounded-2xl bg-gradient-to-br ${c.color} p-4 text-white shadow-soft`}>
                <c.icon size={28} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Banner Promocional / Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white sm:flex-row"
      >
        <div>
          <h2 className="text-2xl font-extrabold">Que tal agendar um banho? 🛁</h2>
          <p className="mt-2 max-w-md text-brand-50">
            Mantenha seu peludo sempre cheiroso e saudável. Agende em poucos cliques.
          </p>
          <Link
            to="/app/agendamentos"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-bold text-brand-600 transition hover:-translate-y-0.5"
          >
            Agendar agora <ArrowRight size={18} />
          </Link>
        </div>
        <PawPrint size={120} className="hidden animate-float text-white/30 sm:block" />
      </motion.div>
    </div>
  )
}
