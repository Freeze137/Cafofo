import { useState } from 'react'
import { Field, TextInput, Select } from '../ui/Field'

// ─────────────────────────────────────────────────────────────────────────
// Formulário de Pet (criar / editar) — usado dentro do Modal de PetsPage.
// ─────────────────────────────────────────────────────────────────────────

const ESPECIES = ['Cachorro', 'Gato', 'Outro']
const PORTES = ['Pequeno', 'Médio', 'Grande']
const SEXOS = ['Macho', 'Fêmea']
const STATUS = ['Disponível', 'Em processo', 'Adotado']

const EMPTY = {
  nome: '', especie: 'Cachorro', raca: '', idade: '', porte: 'Pequeno',
  sexo: 'Macho', cor: '', descricao: '', status: 'Disponível',
}

export default function PetForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.nome.trim()) next.nome = 'Informe o nome do pet.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    try {
      await onSubmit({ ...form, idade: Number(form.idade) || 0 })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nome" error={errors.nome}>
        <TextInput value={form.nome} onChange={set('nome')} error={errors.nome} placeholder="Ex.: Thor" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Espécie">
          <Select value={form.especie} onChange={set('especie')}>
            {ESPECIES.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </Field>
        <Field label="Raça">
          <TextInput value={form.raca} onChange={set('raca')} placeholder="Ex.: Vira-lata" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Idade (anos)">
          <TextInput type="number" min="0" value={form.idade} onChange={set('idade')} />
        </Field>
        <Field label="Porte">
          <Select value={form.porte} onChange={set('porte')}>
            {PORTES.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </Field>
        <Field label="Sexo">
          <Select value={form.sexo} onChange={set('sexo')}>
            {SEXOS.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cor">
          <TextInput value={form.cor} onChange={set('cor')} placeholder="Ex.: Caramelo" />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')}>
            {STATUS.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Descrição">
        <textarea
          className="input-field min-h-24 resize-y"
          value={form.descricao}
          onChange={set('descricao')}
          placeholder="Temperamento, história, cuidados especiais..."
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancelar</button>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Salvando...' : 'Salvar pet'}
        </button>
      </div>
    </form>
  )
}
