import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CalendarDays, Clock, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../services/appointmentService'
import { listPets } from '../services/petService'
import { listServices } from '../services/serviceCatalog'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import AppointmentForm from '../components/appointments/AppointmentForm'
import { STATUS_STYLES } from '../constants/appointmentStatus'
import { formatDate } from '../utils/format'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 3 — AGENDAMENTOS
// Cada agendamento relaciona um pet e um serviço (chaves estrangeiras).
// ─────────────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  // ── Estado da página ──────────────────────────
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // agendamento em edição (ou null = novo)
  const [toDelete, setToDelete] = useState(null) // agendamento aguardando confirmação

  // ── READ: carrega agendamentos, pets e serviços ──
  const load = async () => {
    setLoading(true)
    const [apts, petList, svcList] = await Promise.all([
      listAppointments(user.id),
      listPets(user.id),
      listServices(),
    ])
    setAppointments(apts)
    setPets(petList)
    setServices(svcList)
    setLoading(false)
  }

  // ── Efeito: recarrega ao montar / trocar de usuário ──
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  // ── JOIN local: resolve nomes a partir dos ids ──
  const petName = (id) => pets.find((p) => p.id === id)?.nome || 'Pet removido'
  const service = (id) => services.find((s) => s.id === id)

  // ── CREATE / UPDATE: salva o formulário ───────
  const handleSave = async (data) => {
    if (editing) await updateAppointment(editing.id, data)
    else await createAppointment(user.id, data)
    setFormOpen(false)
    setEditing(null)
    load()
  }

  // ── DELETE: remove o agendamento selecionado ──
  const handleDelete = async () => {
    await deleteAppointment(toDelete.id)
    load()
  }

  // ── Abrir o modal de novo agendamento ─────────
  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  // ── Render ────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Agendamentos 📅"
        description="Marque banho, tosa, hotelzinho e consultas para os seus pets."
        action={
          <button onClick={openNew} className="btn-primary">
            <Plus size={18} /> Novo agendamento
          </button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhum agendamento"
          description="Agende o primeiro serviço para o seu peludo."
          action={
            <button onClick={openNew} className="btn-primary">
              <Plus size={18} /> Novo agendamento
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {appointments.map((apt) => {
              const svc = service(apt.serviceId)
              return (
                <motion.div
                  key={apt.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                      <CalendarDays size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {svc?.nome || 'Serviço'} — {petName(apt.petId)}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={14} /> {formatDate(apt.data)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {apt.hora}
                        </span>
                        {svc && <span className="font-semibold text-brand-600">R$ {svc.preco}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_STYLES[apt.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {apt.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditing(apt)
                        setFormOpen(true)
                      }}
                      className="rounded-xl bg-brand-50 p-2.5 text-brand-700 transition hover:bg-brand-100"
                      aria-label="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setToDelete(apt)}
                      className="rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-100"
                      aria-label="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar agendamento' : 'Novo agendamento'}
      >
        <AppointmentForm
          initialData={editing}
          pets={pets}
          services={services}
          onSubmit={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        message="Deseja realmente cancelar/excluir este agendamento?"
      />
    </div>
  )
}
