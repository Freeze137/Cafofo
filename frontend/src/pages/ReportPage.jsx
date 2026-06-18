import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, FileText, CheckCircle2, ClipboardList } from 'lucide-react'
import { reportAdoptions } from '../services/adoptionService'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

// ─────────────────────────────────────────────────────────────────────────
// RELATÓRIO COM JOIN
//
// Demonstra um JOIN entre TRÊS entidades, feito no BACKEND e entregue pronto
// pelo endpoint /api/adoptions/report:
//
//   ADOÇÕES  ⨝  PETS (petId)  ⨝  VOLUNTÁRIOS (volunteerId)
//
// Cada linha do relatório já vem desnormalizada (nome do pet, do voluntário
// e do adotante), bastando ao frontend exibir e agregar métricas.
// ─────────────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  'Em análise': 'bg-amber-100 text-amber-700',
  Aprovada: 'bg-sky-100 text-sky-700',
  Concluída: 'bg-emerald-100 text-emerald-700',
  Cancelada: 'bg-red-100 text-red-600',
}

export default function ReportPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    reportAdoptions()
      .then((data) => { setRows(data); setError('') })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const concluidas = useMemo(() => rows.filter((r) => r.status === 'Concluída').length, [rows])
  const emAndamento = useMemo(
    () => rows.filter((r) => r.status === 'Em análise' || r.status === 'Aprovada').length,
    [rows],
  )

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
  }

  return (
    <div>
      <PageHeader
        title="Relatório de Adoções 📊"
        description="Cruzamento (JOIN) entre Adoções, Pets e Voluntários."
      />

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error} — verifique se o backend está rodando.
        </div>
      )}

      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <MetricCard icon={ClipboardList} label="Processos" value={rows.length} color="from-sky-400 to-sky-600" />
        <MetricCard icon={CheckCircle2} label="Concluídas" value={concluidas} color="from-emerald-400 to-emerald-600" />
        <MetricCard icon={BarChart3} label="Em andamento" value={emAndamento} color="from-brand-400 to-brand-600" />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Sem dados para o relatório"
          description="Cadastre pets, voluntários e registre adoções para gerar o relatório com JOIN."
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
                  <th className="px-6 py-4">Pet</th>
                  <th className="px-6 py-4">Espécie</th>
                  <th className="px-6 py-4">Adotante</th>
                  <th className="px-6 py-4">Voluntário</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="transition hover:bg-brand-50/40">
                    <td className="px-6 py-4 font-semibold text-slate-800">{r.pet}</td>
                    <td className="px-6 py-4 text-slate-500">{r.especie}</td>
                    <td className="px-6 py-4 text-slate-700">{r.adotante}</td>
                    <td className="px-6 py-4 text-slate-500">{r.voluntario}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(r.data)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[r.status] || 'bg-slate-100 text-slate-600'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

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

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
