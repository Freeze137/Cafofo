import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartHandshake, Plus, Pencil, Trash2, Mail, Phone } from 'lucide-react'
import { listVolunteers, createVolunteer, updateVolunteer, deleteVolunteer } from '../services/volunteerService'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import VolunteerForm from '../components/volunteers/VolunteerForm'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 3 — Voluntários
// ─────────────────────────────────────────────────────────────────────────

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)

  const load = () => {
    setLoading(true)
    listVolunteers()
      .then((data) => { setVolunteers(data); setError('') })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (data) => {
    if (editing?.id) await updateVolunteer(editing.id, data)
    else await createVolunteer(data)
    setEditing(null)
    load()
  }

  const handleDelete = async () => {
    await deleteVolunteer(removing.id)
    load()
  }

  return (
    <div>
      <PageHeader
        title="Voluntários 🤝"
        description="Equipe que ajuda a cuidar do abrigo e dos processos de adoção."
        action={
          <button onClick={() => setEditing({})} className="btn-primary">
            <Plus size={18} /> Novo voluntário
          </button>
        }
      />

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error} — verifique se o backend está rodando.
        </div>
      )}

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      ) : volunteers.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          title="Nenhum voluntário cadastrado"
          description="Cadastre a equipe que ajuda no abrigo."
          action={<button onClick={() => setEditing({})} className="btn-primary"><Plus size={18} /> Novo voluntário</button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {volunteers.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
                    {v.nome?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{v.nome}</h3>
                    <p className="text-sm text-slate-500">{v.funcao || 'Voluntário(a)'}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${v.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                  {v.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-500">
                {v.email && <p className="flex items-center gap-2"><Mail size={15} /> {v.email}</p>}
                {v.telefone && <p className="flex items-center gap-2"><Phone size={15} /> {v.telefone}</p>}
                {v.disponibilidade && <p className="text-xs text-slate-400">Disponível: {v.disponibilidade}</p>}
              </div>

              <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                <button onClick={() => setEditing(v)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600">
                  <Pencil size={15} /> Editar
                </button>
                <button onClick={() => setRemoving(v)} className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Editar voluntário' : 'Novo voluntário'}>
        {editing !== null && (
          <VolunteerForm initial={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={handleDelete}
        message={`Remover "${removing?.nome}"? Esta ação não poderá ser desfeita.`}
      />
    </div>
  )
}
