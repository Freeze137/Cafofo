import { motion } from 'framer-motion'
import { Dog, Cat, Bird, Pencil, Trash2 } from 'lucide-react'

// Mapeia espécie → ícone correspondente.
const ICONS = { Cachorro: Dog, Gato: Cat, Pássaro: Bird }

// Card de exibição de um pet com ações de editar e excluir.
export default function PetCard({ pet, onEdit, onDelete }) {
  const Icon = ICONS[pet.especie] || Dog

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="card group flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-soft">
          <Icon size={30} />
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          {pet.porte}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-bold text-slate-800">{pet.nome}</h3>
      <p className="text-slate-500">
        {pet.especie} • {pet.raca}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="text-slate-400">Idade</dt>
          <dd className="font-semibold text-slate-700">{pet.idade} ano(s)</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="text-slate-400">Cor</dt>
          <dd className="font-semibold text-slate-700">{pet.cor || '—'}</dd>
        </div>
      </dl>

      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
        <button
          onClick={() => onEdit(pet)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-50 py-2.5 font-semibold text-brand-700 transition hover:bg-brand-100"
        >
          <Pencil size={16} /> Editar
        </button>
        <button
          onClick={() => onDelete(pet)}
          className="flex items-center justify-center rounded-xl bg-red-50 px-3.5 py-2.5 text-red-500 transition hover:bg-red-100"
          aria-label="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.article>
  )
}
