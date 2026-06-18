import { useState } from 'react'
import { Field, TextInput, Select } from '../ui/Field'

// ─────────────────────────────────────────────────────────────────────────
// Formulário de Voluntário (criar / editar) — usado no Modal de VolunteersPage.
// ─────────────────────────────────────────────────────────────────────────

const EMPTY = {
  nome: '', email: '', telefone: '', funcao: '', disponibilidade: '', ativo: true,
}

export default function VolunteerForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.nome.trim()) next.nome = 'Informe o nome do voluntário.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    try {
      await onSubmit({ ...form, ativo: form.ativo === true || form.ativo === 'true' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nome" error={errors.nome}>
        <TextInput value={form.nome} onChange={set('nome')} error={errors.nome} placeholder="Ex.: Mariana Silva" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="E-mail">
          <TextInput type="email" value={form.email} onChange={set('email')} placeholder="nome@cafofo.org" />
        </Field>
        <Field label="Telefone">
          <TextInput value={form.telefone} onChange={set('telefone')} placeholder="(11) 90000-0000" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Função">
          <TextInput value={form.funcao} onChange={set('funcao')} placeholder="Ex.: Cuidados gerais" />
        </Field>
        <Field label="Disponibilidade">
          <TextInput value={form.disponibilidade} onChange={set('disponibilidade')} placeholder="Ex.: Fins de semana" />
        </Field>
      </div>

      <Field label="Situação">
        <Select value={String(form.ativo)} onChange={(e) => setForm((f) => ({ ...f, ativo: e.target.value === 'true' }))}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </Select>
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancelar</button>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Salvando...' : 'Salvar voluntário'}
        </button>
      </div>
    </form>
  )
}
