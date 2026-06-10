// ─────────────────────────────────────────────────────────────────────────
// Constantes de STATUS dos agendamentos (fonte única da verdade)
//
// Antes, a lista de status vivia no AppointmentForm, as cores do badge no
// AppointmentsPage e o status padrão ('Pendente') no appointmentService —
// três cópias da mesma regra. Centralizar aqui elimina as "strings mágicas"
// e garante que formulário, listagem e serviço falem sempre a mesma língua.
// ─────────────────────────────────────────────────────────────────────────

// Status que um agendamento pode assumir (ordem usada nos <select>).
export const APPOINTMENT_STATUSES = ['Pendente', 'Confirmado', 'Concluído', 'Cancelado']

// Status atribuído a um agendamento recém-criado.
export const DEFAULT_STATUS = 'Pendente'

// Classes Tailwind do badge conforme o status (apresentação).
export const STATUS_STYLES = {
  Pendente: 'bg-amber-100 text-amber-700',
  Confirmado: 'bg-sky-100 text-sky-700',
  Concluído: 'bg-emerald-100 text-emerald-700',
  Cancelado: 'bg-red-100 text-red-600',
}
