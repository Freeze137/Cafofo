import { useState } from 'react'
import { Field, TextInput, Select } from '../ui/Field'

// ── Categorias disponíveis no select ──────────
const CATEGORIAS = ['Alimentação', 'Brinquedos', 'Higiene', 'Saúde', 'Acessórios']

// ─────────────────────────────────────────────────────────────────────────
// ProductForm — Formulário de criação/edição de produto da lojinha.
// ─────────────────────────────────────────────────────────────────────────
export default function ProductForm({ initialData, onSubmit, onCancel }) {
  // ── Estado do formulário (pré-preenchido na edição) ──
  const [form, setForm] = useState({
    nome: initialData?.nome || '',
    categoria: initialData?.categoria || 'Alimentação',
    preco: initialData?.preco ?? '',
    estoque: initialData?.estoque ?? '',
  })
  const [errors, setErrors] = useState({})

  // ── Atualiza um campo do formulário ───────────
  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  // ── Validação (nome, preço e estoque) ─────────
  const validate = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe o nome do produto.'
    if (form.preco === '' || Number(form.preco) < 0) e.preco = 'Preço inválido.'
    if (form.estoque === '' || Number(form.estoque) < 0) e.estoque = 'Estoque inválido.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit: valida e converte números antes de salvar ──
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      preco: Number(form.preco),
      estoque: Number(form.estoque),
    })
  }

  // ── Render ────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nome *" error={errors.nome}>
        <TextInput
          value={form.nome}
          onChange={set('nome')}
          placeholder="Ex.: Ração Premium 10kg"
          error={errors.nome}
        />
      </Field>

      <Field label="Categoria">
        <Select value={form.categoria} onChange={set('categoria')}>
          {CATEGORIAS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preço (R$) *" error={errors.preco}>
          <TextInput
            type="number"
            step="0.01"
            min="0"
            value={form.preco}
            onChange={set('preco')}
            placeholder="0,00"
            error={errors.preco}
          />
        </Field>
        <Field label="Estoque *" error={errors.estoque}>
          <TextInput
            type="number"
            min="0"
            value={form.estoque}
            onChange={set('estoque')}
            placeholder="0"
            error={errors.estoque}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? 'Salvar alterações' : 'Adicionar produto'}
        </button>
      </div>
    </form>
  )
}
