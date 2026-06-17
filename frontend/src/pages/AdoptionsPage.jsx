import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Plus, Pencil, Trash2 } from 'lucide-react'
import { listAdoptions, createAdoption, updateAdoption, deleteAdoption } from '../services/adoptionService'
import { listPets } from '../services/petService'
import { listVolunteers } from '../services/volunteerService'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import AdoptionForm from '../components/adoptions/AdoptionForm'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 2 — Adoções
// Lista em tabela, cruzando os nomes do pet e do voluntário (FKs) carregados
// junto. Criação/edição via Modal; exclusão com confirmação.
// ─────────────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  'Em análise': 'bg-amber-100 text-amber-700',
  Aprovada: 'bg-sky-100 text-sky-700',
  Concluída: 'bg-emerald-100 text-emerald-700',
  Cancelada: 'bg-red-100 text-red-600',
}

export default function AdoptionsPage() {
  const [adoptions, setAdoptions] = useState([])
  const [pets, setPets] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([listAdoptions(), listPets(), listVolunteers()])
      .then(([a, p, v]) => { setAdoptions(a); setPets(p); setVolunteers(v); setError('') })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const petName = (id) => pets.find((p) => p.id === id)?.nome ?? 'Pet removido'
  const volunteerName = (id) => volunteers.find((v) => v.id === id)?.nome ?? '—'

  const handleSubmit = async (data) => {
    if (editing?.id) await updateAdoption(editing.id, data)
    else await createAdoption(data)
    setEditing(null)
    load()
  }

  const handleDelete = async () => {
    await deleteAdoption(removing.id)
    load()
  }

  return (
    <div>
      <PageHeader
        title="Adoções 📋"
        description="Processos de adoção e vínculo entre pets e voluntários."
        action={
          <button onClick={() => setEditing({})} className="btn-primary">
            <Plus size={18} /> Nova adoção
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
      ) : adoptions.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nenhuma adoção registrada"
          description="Registre o primeiro processo de adoção vinculando um pet."
          action={<button onClick={() => setEditing({})} className="btn-primary"><Plus size={18} /> Nova adoção</button>}
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
                  <th className="px-6 py-4">Adotante</th>
                  <th className="px-6 py-4">Voluntário</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adoptions.map((a) => (
                  <tr key={a.id} className="transition hover:bg-brand-50/40">
                    <td className="px-6 py-4 font-semibold text-slate-800">{petName(a.petId)}</td>
                    <td className="px-6 py-4 text-slate-600">{a.adotante || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{volunteerName(a.volunteerId)}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(a.data)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[a.status] || 'bg-slate-100 text-slate-600'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(a)} className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600" aria-label="Editar">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setRemoving(a)} className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600" aria-label="Excluir">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Editar adoção' : 'Nova adoção'}>
        {editing !== null && (
          <AdoptionForm
            initial={editing}
            pets={pets}
            volunteers={volunteers}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={handleDelete}
        message={`Excluir o processo de adoção de "${petName(removing?.petId)}"?`}
      />
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
