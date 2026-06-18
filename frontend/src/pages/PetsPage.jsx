import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Dog, PawPrint, Pencil, Trash2 } from 'lucide-react'
import { listPets, createPet, updatePet, deletePet } from '../services/petService'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import PetForm from '../components/pets/PetForm'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 1 — Pets
// Listagem em cards + criação/edição via Modal + exclusão com confirmação.
// ─────────────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Disponível: 'bg-emerald-100 text-emerald-700',
  'Em processo': 'bg-amber-100 text-amber-700',
  Adotado: 'bg-slate-200 text-slate-600',
}

export default function PetsPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // objeto pet ou {} (novo) ou null (fechado)
  const [removing, setRemoving] = useState(null)

  const load = () => {
    setLoading(true)
    listPets()
      .then((data) => { setPets(data); setError('') })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (data) => {
    if (editing?.id) await updatePet(editing.id, data)
    else await createPet(data)
    setEditing(null)
    load()
  }

  const handleDelete = async () => {
    await deletePet(removing.id)
    load()
  }

  return (
    <div>
      <PageHeader
        title="Pets 🐾"
        description="Cadastro dos animais do abrigo disponíveis para adoção."
        action={
          <button onClick={() => setEditing({})} className="btn-primary">
            <PawPrint size={18} /> Novo pet
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
      ) : pets.length === 0 ? (
        <EmptyState
          icon={Dog}
          title="Nenhum pet cadastrado"
          description="Cadastre o primeiro animal para começar a gerenciar as adoções."
          action={<button onClick={() => setEditing({})} className="btn-primary"><PawPrint size={18} /> Novo pet</button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet, i) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-brand-100 p-3 text-brand-500">
                    <Dog size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{pet.nome}</h3>
                    <p className="text-sm text-slate-500">{pet.especie} · {pet.raca || 'SRD'}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[pet.status] || 'bg-slate-100 text-slate-600'}`}>
                  {pet.status}
                </span>
              </div>

              <p className="mt-4 flex-1 text-sm text-slate-500">
                {pet.descricao || 'Sem descrição.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-lg bg-slate-100 px-2 py-1">{pet.porte}</span>
                <span className="rounded-lg bg-slate-100 px-2 py-1">{pet.sexo}</span>
                {pet.idade ? <span className="rounded-lg bg-slate-100 px-2 py-1">{pet.idade} ano(s)</span> : null}
                {pet.cor ? <span className="rounded-lg bg-slate-100 px-2 py-1">{pet.cor}</span> : null}
              </div>

              <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                <button onClick={() => setEditing(pet)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600">
                  <Pencil size={15} /> Editar
                </button>
                <button onClick={() => setRemoving(pet)} className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Editar pet' : 'Novo pet'}>
        {editing !== null && (
          <PetForm initial={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
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
