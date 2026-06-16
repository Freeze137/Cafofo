import { useState } from 'react'
import { Field, TextInput, Select } from '../ui/Field'

// ─────────────────────────────────────────────────────────────────────────
// Formulário de Pets
//
// Formulário de criação/edição de pet (usado dentro de um Modal).
// Recebe `initialData` para edição e dispara `onSubmit` com os dados válidos.
// ─────────────────────────────────────────────────────────────────────────

// ── 1. Configurações e Dados Estáticos ───────────────────────────────────
const ESPECIES = ['Cachorro', 'Gato', 'Pássaro', 'Outro']
const PORTES = ['Pequeno', 'Médio', 'Grande']

export default function PetForm({ initialData, onSubmit, onCancel }) {
  // ── 2. Estados ─────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    nome: initialData?.nome || '',
    especie: initialData?.especie || 'Cachorro',
    raca: initialData?.raca || '',
    idade: initialData?.idade ?? '',
    porte: initialData?.porte || 'Pequeno',
    cor: initialData?.cor || '',
  })
  const [errors, setErrors] = useState({})

  // ── 3. Handlers e Validação ────────────────────────────────────────────
  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe o nome do pet.'
    if (!form.raca.trim()) e.raca = 'Informe a raça.'
    if (form.idade === '' || Number(form.idade) < 0)
      e.idade = 'Idade inválida.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, idade: Number(form.idade) })
  }

  // ── 4. Renderização do Formulário ──────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Linha 1: Nome */}
      <Field label="Nome *" error={errors.nome}>
        <TextInput
          value={form.nome}
          onChange={set('nome')}
          placeholder="Ex.: Thor"
          error={errors.nome}
        />
      </Field>

      {/* Linha 2: Espécie e Porte (Lado a lado) */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Espécie">
          <Select value={form.especie} onChange={set('especie')}>
            {ESPECIES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
        <Field label="Porte">
          <Select value={form.porte} onChange={set('porte')}>
            {PORTES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
      </div>

      {/* Linha 3: Raça */}
      <Field label="Raça *" error={errors.raca}>
        <TextInput
          value={form.raca}
          onChange={set('raca')}
          placeholder="Ex.: Golden Retriever"
          error={errors.raca}
        />
      </Field>

      {/* Linha 4: Idade e Cor (Lado a lado) */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Idade (anos) *" error={errors.idade}>
          <TextInput
            type="number"
            min="0"
            value={form.idade}
            onChange={set('idade')}
            placeholder="Ex.: 3"
            error={errors.idade}
          />
        </Field>
        <Field label="Cor">
          <TextInput value={form.cor} onChange={set('cor')} placeholder="Ex.: Caramelo" />
        </Field>
      </div>

      {/* Ações: Cancelar e Salvar */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? 'Salvar alterações' : 'Adicionar pet'}
        </button>
      </div>
    </form>
  )
}
