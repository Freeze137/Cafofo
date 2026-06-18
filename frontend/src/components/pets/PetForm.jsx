import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PawPrint } from 'lucide-react'
import { Field, TextInput, Select } from '../ui/Field'

// ─────────────────────────────────────────────────────────────────────────
// Formulário de Pet (criar / editar) — usado dentro do Modal de PetsPage.
//
// Ao salvar com sucesso, exibe um "carimbo" de pata sobre o formulário antes
// de fechar o modal — um feedback visual lúdico que combina com o tema.
// ─────────────────────────────────────────────────────────────────────────

// Duração do carimbo antes de concluir o salvamento (ms).
const STAMP_MS = 850

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
  const [stamped, setStamped] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.nome.trim()) next.nome = 'Informe o nome do pet.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    setStamped(true)
    // Deixa o carimbo de pata tocar antes de fechar o modal.
    await new Promise((resolve) => setTimeout(resolve, STAMP_MS))
    try {
      await onSubmit({ ...form, idade: Number(form.idade) || 0 })
    } catch {
      // Falhou: limpa o carimbo para o usuário corrigir e tentar de novo.
      setStamped(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4">
      {/* Carimbo de pata exibido ao salvar */}
      <AnimatePresence>
        {stamped && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Anel de "tinta" que se expande e some */}
            <motion.span
              className="absolute rounded-full border-4 border-brand-400/60"
              initial={{ width: 40, height: 40, opacity: 0.7 }}
              animate={{ width: 220, height: 220, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            {/* A pata batendo como carimbo */}
            <motion.div
              initial={{ scale: 2.6, opacity: 0, rotate: -14 }}
              animate={{ scale: [2.6, 0.85, 1], opacity: [0, 1, 1], rotate: -12 }}
              transition={{ duration: 0.45, times: [0, 0.6, 1], ease: 'easeOut' }}
            >
              <PawPrint size={120} className="text-brand-500 drop-shadow-lg" strokeWidth={2.2} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
