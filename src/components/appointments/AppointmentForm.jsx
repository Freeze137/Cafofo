import { useState } from 'react'
import { Field, TextInput, Select } from '../ui/Field'
import { APPOINTMENT_STATUSES, DEFAULT_STATUS } from '../../constants/appointmentStatus'

// Formulário de agendamento de serviço.
// Permite escolher o pet, o serviço, a data, o horário e o status.
// `pets` e `services` vêm do banco; os selects ficam vazios caso não haja pets.
export default function AppointmentForm({
  initialData,
  pets,
  services,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    petId: initialData?.petId || pets[0]?.id || '',
    serviceId: initialData?.serviceId || services[0]?.id || '',
    data: initialData?.data || '',
    hora: initialData?.hora || '',
    status: initialData?.status || DEFAULT_STATUS,
  })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.petId) e.petId = 'Selecione um pet.'
    if (!form.serviceId) e.serviceId = 'Selecione um serviço.'
    if (!form.data) e.data = 'Escolha a data.'
    if (!form.hora) e.hora = 'Escolha o horário.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  // Sem pets cadastrados não é possível agendar.
  if (pets.length === 0) {
    return (
      <div className="rounded-xl bg-amber-50 p-4 text-amber-700">
        Você precisa cadastrar um pet antes de agendar um serviço. 🐾
        <div className="mt-4 flex justify-end">
          <button onClick={onCancel} className="btn-ghost">
            Entendi
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Pet *" error={errors.petId}>
        <Select value={form.petId} onChange={set('petId')} error={errors.petId}>
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} ({p.especie})
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Serviço *" error={errors.serviceId}>
        <Select value={form.serviceId} onChange={set('serviceId')} error={errors.serviceId}>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome} — R$ {s.preco}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Data *" error={errors.data}>
          <TextInput type="date" value={form.data} onChange={set('data')} error={errors.data} />
        </Field>
        <Field label="Horário *" error={errors.hora}>
          <TextInput type="time" value={form.hora} onChange={set('hora')} error={errors.hora} />
        </Field>
      </div>

      <Field label="Status">
        <Select value={form.status} onChange={set('status')}>
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? 'Salvar' : 'Agendar serviço'}
        </button>
      </div>
    </form>
  )
}
