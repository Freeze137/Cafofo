import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus, Dog } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { listPets, createPet, updatePet, deletePet } from '../services/petService'
import PageHeader from '../components/ui/PageHeader'
import PetCard from '../components/pets/PetCard'
import PetForm from '../components/pets/PetForm'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 1 — PETS
// Página completa de gerenciamento de pets: Create, Read, Update, Delete.
// O estado da lista é mantido com useState e renderizado com .map().
// ─────────────────────────────────────────────────────────────────────────
export default function PetsPage() {
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // pet em edição (ou null = novo)
  const [toDelete, setToDelete] = useState(null)

  // READ — carrega os pets do usuário.
  const load = async () => {
    setLoading(true)
    setPets(await listPets(user.id))
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  // CREATE / UPDATE — salva o formulário.
  const handleSave = async (data) => {
    if (editing) {
      await updatePet(editing.id, data)
    } else {
      await createPet(user.id, data)
    }
    setFormOpen(false)
    setEditing(null)
    load()
  }

  // DELETE — remove o pet selecionado.
  const handleDelete = async () => {
    await deletePet(toDelete.id)
    load()
  }

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (pet) => {
    setEditing(pet)
    setFormOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Meus Pets 🐾"
        description="Cadastre e gerencie todos os seus peludos."
        action={
          <button onClick={openNew} className="btn-primary">
            <Plus size={18} /> Adicionar pet
          </button>
        }
      />

      {loading ? (
        <GridSkeleton />
      ) : pets.length === 0 ? (
        <EmptyState
          icon={Dog}
          title="Nenhum pet cadastrado"
          description="Adicione o seu primeiro peludo para começar a agendar serviços."
          action={
            <button onClick={openNew} className="btn-primary">
              <Plus size={18} /> Adicionar pet
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onEdit={openEdit} onDelete={setToDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de formulário (criar/editar) */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar pet' : 'Adicionar pet'}
      >
        <PetForm
          initialData={editing}
          onSubmit={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        message={`Deseja realmente excluir ${toDelete?.nome}?`}
      />
    </div>
  )
}

// Esqueleto de carregamento.
function GridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  )
}
