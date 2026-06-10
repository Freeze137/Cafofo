import { motion } from 'framer-motion'

// ── Estado vazio amigável para listas sem registros ──
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center"
    >
      {Icon && (
        <div className="mb-4 rounded-2xl bg-brand-50 p-4 text-brand-500">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-700">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}
