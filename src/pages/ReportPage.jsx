import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, FileText, DollarSign, CalendarCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { listAppointments } from '../services/appointmentService'
import { listPets } from '../services/petService'
import { listServices } from '../services/serviceCatalog'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import { formatDate, formatCurrency } from '../utils/format'

// ─────────────────────────────────────────────────────────────────────────
// RELATÓRIO COM JOIN (Parte 3 da avaliação)
//
// Demonstra um JOIN entre TRÊS entidades, feito em JavaScript/React:
//   AGENDAMENTOS  ⨝  PETS (petId)  ⨝  SERVIÇOS (serviceId)  ⨝  USUÁRIO (ownerId)
//
// As chaves estrangeiras são simuladas por ids. O cruzamento usa
// .map() + .find() para montar uma linha desnormalizada por agendamento.
// ─────────────────────────────────────────────────────────────────────────
export default function ReportPage() {
  // ── Estado da página ──────────────────────────
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // ── READ: carrega as três entidades em paralelo ──
  useEffect(() => {
    Promise.all([
      listAppointments(user.id),
      listPets(user.id),
      listServices(),
    ]).then(([apts, petList, svcList]) => {
      setAppointments(apts)
      setPets(petList)
      setServices(svcList)
      setLoading(false)
    })
  }, [user.id])

  // ── O JOIN propriamente dito ──────────────────
  // Para cada agendamento, busca o pet e o serviço pelo id e produz uma
  // linha "achatada" com todos os dados relacionados.
  const rows = useMemo(() => {
    return appointments.map((apt) => {
      const pet = pets.find((p) => p.id === apt.petId)
      const service = services.find((s) => s.id === apt.serviceId)
      return {
        id: apt.id,
        tutor: user.nome, // entidade Usuário (dono)
        pet: pet?.nome ?? 'Pet removido',
        especie: pet?.especie ?? '—',
        servico: service?.nome ?? 'Serviço removido',
        preco: service?.preco ?? 0,
        data: apt.data,
        hora: apt.hora,
        status: apt.status,
      }
    })
  }, [appointments, pets, services, user.nome])

  // ── Métricas agregadas a partir do JOIN ───────
  const totalReceita = rows
    .filter((r) => r.status !== 'Cancelado')
    .reduce((acc, r) => acc + Number(r.preco), 0)
  const concluidos = rows.filter((r) => r.status === 'Concluído').length

  // ── Estado de carregamento ────────────────────
  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
  }

  // ── Render ────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Relatório de Atendimentos 📊"
        description="Cruzamento (JOIN) entre Agendamentos, Pets, Serviços e Tutor."
      />

      {/* Cartões de métricas */}
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <MetricCard icon={CalendarCheck} label="Agendamentos" value={rows.length} color="from-sky-400 to-sky-600" />
        <MetricCard icon={DollarSign} label="Receita prevista" value={formatCurrency(totalReceita)} color="from-emerald-400 to-emerald-600" />
        <MetricCard icon={BarChart3} label="Concluídos" value={concluidos} color="from-brand-400 to-brand-600" />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Sem dados para o relatório"
          description="Cadastre pets e agende serviços para gerar o relatório com JOIN."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Tutor</th>
                  <th className="px-6 py-4">Pet</th>
                  <th className="px-6 py-4">Espécie</th>
                  <th className="px-6 py-4">Serviço</th>
                  <th className="px-6 py-4">Data / Hora</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="transition hover:bg-brand-50/40">
                    <td className="px-6 py-4 font-medium text-slate-700">{r.tutor}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{r.pet}</td>
                    <td className="px-6 py-4 text-slate-500">{r.especie}</td>
                    <td className="px-6 py-4 text-slate-700">{r.servico}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(r.data)} às {r.hora}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-600">
                      {formatCurrency(r.preco)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-700">
                  <td className="px-6 py-4" colSpan={5}>
                    Total (exceto cancelados)
                  </td>
                  <td className="px-6 py-4 text-brand-600" colSpan={2}>
                    {formatCurrency(totalReceita)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── Cartão de métrica (KPI) do topo do relatório ──
function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
      </div>
      <div className={`rounded-2xl bg-gradient-to-br ${color} p-3.5 text-white shadow-soft`}>
        <Icon size={24} />
      </div>
    </div>
  )
}
