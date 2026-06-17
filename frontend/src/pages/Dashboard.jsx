import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dog, ClipboardList, HeartHandshake, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { listPets } from '../services/petService'
import { listAdoptions } from '../services/adoptionService'
import { listVolunteers } from '../services/volunteerService'
import PageHeader from '../components/ui/PageHeader'

// ─────────────────────────────────────────────────────────────────────────
// Visão Geral (Dashboard)
//
// Página inicial após o login. Resume o abrigo com indicadores (KPIs) das
// três entidades e atalhos para os respectivos CRUDs.
// ─────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ pets: 0, adoptions: 0, volunteers: 0 })

  useEffect(() => {
    // Carrega as contagens de cada coleção em paralelo. Falhas (ex.: backend
    // offline) são ignoradas para não quebrar o painel — os KPIs ficam em zero.
    Promise.all([
      listPets().catch(() => []),
      listAdoptions().catch(() => []),
      listVolunteers().catch(() => []),
    ]).then(([pets, adoptions, volunteers]) => {
      setStats({ pets: pets.length, adoptions: adoptions.length, volunteers: volunteers.length })
    })
  }, [])

  const cards = [
    { to: '/app/pets', label: 'Pets', value: stats.pets, icon: Dog, color: 'from-brand-400 to-brand-600' },
    { to: '/app/adocoes', label: 'Adoções', value: stats.adoptions, icon: ClipboardList, color: 'from-sky-400 to-sky-600' },
    { to: '/app/voluntarios', label: 'Voluntários', value: stats.volunteers, icon: HeartHandshake, color: 'from-emerald-400 to-emerald-600' },
  ]

  return (
    <div>
      <PageHeader
        title={`Olá, ${user.nome?.split(' ')[0]}! 👋`}
        description="Resumo do abrigo CAFOFO ADOÇÃO."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={c.to} className="card group flex items-center justify-between hover:shadow-soft">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white"
      >
        {/* Foto de fundo (pet) + overlay laranja para manter o texto legível. */}
        <img
          src="/img/dashboard-banner.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-600/80 to-brand-700/85" />

        <div className="relative z-10 [text-shadow:_0_1px_8px_rgb(124_45_18_/_55%)]">
          <h2 className="text-2xl font-extrabold drop-shadow-sm">Cada adoção transforma uma vida 🐶🐱</h2>
          <p className="mt-2 max-w-md text-brand-50">
            Cadastre um novo animal disponível e ajude-o a encontrar um lar.
          </p>
          <Link
            to="/app/pets"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-bold text-brand-600 shadow-lg transition hover:-translate-y-0.5 [text-shadow:none]"
          >
            Cadastrar pet <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
