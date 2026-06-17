import { motion } from 'framer-motion'
import { Search, ClipboardList, HeartHandshake, Home } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────
// Seção "Como adotar"
//
// Explica em quatro passos o processo de adoção de um animal do abrigo,
// usando os cards animados do Framer Motion.
// ─────────────────────────────────────────────────────────────────────────

// ── 1. Dados Estáticos ───────────────────────────────────────────────────
const STEPS = [
  {
    icon: Search,
    title: '1. Conheça os pets',
    desc: 'Veja os animais disponíveis no abrigo e encontre aquele que combina com você.',
  },
  {
    icon: ClipboardList,
    title: '2. Inicie o processo',
    desc: 'Registre seu interesse e converse com nossa equipe de voluntários.',
  },
  {
    icon: HeartHandshake,
    title: '3. Visita e aprovação',
    desc: 'Agende uma visita ao abrigo e finalize o processo com tranquilidade.',
  },
  {
    icon: Home,
    title: '4. Leve para casa',
    desc: 'Adoção concluída! Seu novo amigo ganha um lar cheio de amor.',
  },
]

export default function Services() {
  // ── 2. Renderização da Seção ───────────────────────────────────────────
  return (
    <section id="como-adotar" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Como <span className="text-brand-500">adotar</span>
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Adotar é um ato de amor — e mais simples do que você imagina.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8 }}
            className="card group cursor-default hover:shadow-soft"
          >
            <div className="mb-5 inline-flex rounded-2xl bg-brand-100 p-4 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white">
              <s.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{s.title}</h3>
            <p className="mt-2 text-slate-500">{s.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
