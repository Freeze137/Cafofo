import { useState } from 'react'
import { Field, TextInput, Select } from '../ui/Field'

// Espécies e portes disponíveis.
const ESPECIES = ['Cachorro', 'Gato', 'Pássaro', 'Outro']
const PORTES = ['Pequeno', 'Médio', 'Grande']

// Formulário de criação/edição de pet (usado dentro de um Modal).
// Recebe `initialData` para edição e dispara `onSubmit` com os dados válidos.
export default function PetForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nome: initialData?.nome || '',
    especie: initialData?.especie || 'Cachorro',
    raca: initialData?.raca || '',
    idade: initialData?.idade ?? '',
    porte: initialData?.porte || 'Pequeno',
    cor: initialData?.cor || '',
  })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  // Validação de campos obrigatórios.
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nome *" error={errors.nome}>
        <TextInput
          value={form.nome}
          onChange={set('nome')}
          placeholder="Ex.: Thor"
          error={errors.nome}
        />
      </Field>

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

      <Field label="Raça *" error={errors.raca}>
        <TextInput
          value={form.raca}
          onChange={set('raca')}
          placeholder="Ex.: Golden Retriever"
          error={errors.raca}
        />
      </Field>

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
