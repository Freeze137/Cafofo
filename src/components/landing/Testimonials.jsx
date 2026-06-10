import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

// ── Dados dos depoimentos de clientes ─────────
const TESTIMONIALS = [
  {
    name: 'Mariana Silva',
    pet: 'tutora do Thor',
    text: 'Meu Golden ama o hotelzinho! Sempre volta cheiroso e feliz. Equipe nota 10.',
  },
  {
    name: 'Rafael Costa',
    pet: 'tutor da Mimi',
    text: 'O agendamento online facilitou demais a minha vida. Atendimento impecável!',
  },
  {
    name: 'Juliana Pereira',
    pet: 'tutora do Bob',
    text: 'Confio de olhos fechados. Cuidam do meu pet como se fosse da família.',
  },
]

export default function Testimonials() {
  return (
    <section id="depoimentos" className="bg-brand-50/60 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Quem confia, <span className="text-brand-500">recomenda</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Histórias reais de tutores que fazem parte da família CAFOFOPELUDOS.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card relative"
            >
              <Quote className="absolute right-6 top-6 text-brand-100" size={40} />
              <div className="mb-3 flex gap-1 text-brand-400">
                {Array.from({ length: 5 }).map((_, n) => (
                  <Star key={n} size={18} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-slate-600">“{t.text}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{t.name}</p>
                  <p className="text-sm text-slate-400">{t.pet}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
