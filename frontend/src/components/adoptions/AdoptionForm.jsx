import { useState } from 'react'
import { Field, TextInput, Select } from '../ui/Field'

// ─────────────────────────────────────────────────────────────────────────
// Formulário de Adoção (criar / editar) — usado no Modal de AdoptionsPage.
//
// Recebe as listas de `pets` e `volunteers` para popular os selects das
// chaves estrangeiras (petId / volunteerId).
// ─────────────────────────────────────────────────────────────────────────

const STATUS = ['Em análise', 'Aprovada', 'Concluída', 'Cancelada']

const EMPTY = {
  petId: '', volunteerId: '', adotante: '', contato: '',
  data: '', status: 'Em análise', observacoes: '',
}

export default function AdoptionForm({ initial, pets = [], volunteers = [], onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.petId) next.petId = 'Selecione o pet.'
    if (!form.adotante.trim()) next.adotante = 'Informe o adotante.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    try {
      await onSubmit(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pet" error={errors.petId}>
          <Select value={form.petId} onChange={set('petId')} error={errors.petId}>
            <option value="">Selecione...</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>{p.nome} ({p.especie})</option>
            ))}
          </Select>
        </Field>
        <Field label="Voluntário responsável">
          <Select value={form.volunteerId} onChange={set('volunteerId')}>
            <option value="">Sem responsável</option>
            {volunteers.map((v) => (
              <option key={v.id} value={v.id}>{v.nome}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Adotante" error={errors.adotante}>
          <TextInput value={form.adotante} onChange={set('adotante')} error={errors.adotante} placeholder="Nome de quem adota" />
        </Field>
        <Field label="Contato">
          <TextInput value={form.contato} onChange={set('contato')} placeholder="(11) 90000-0000" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Data">
          <TextInput type="date" value={form.data} onChange={set('data')} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')}>
            {STATUS.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Observações">
        <textarea
          className="input-field min-h-24 resize-y"
          value={form.observacoes}
          onChange={set('observacoes')}
          placeholder="Detalhes do processo, visitas, condições..."
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancelar</button>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Salvando...' : 'Salvar adoção'}
        </button>
      </div>
    </form>
  )
}
