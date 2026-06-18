import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────
// Seção de Depoimentos (Prova Social)
//
// Exibe avaliações de clientes reais para gerar confiança nos visitantes.
// Utiliza o Framer Motion para animar a entrada dos cards lado a lado.
// ─────────────────────────────────────────────────────────────────────────

// ── 1. Dados Estáticos ───────────────────────────────────────────────────
// Lista de avaliações definida fora do componente para não ser recriada a cada renderização.
const TESTIMONIALS = [
  {
    name: 'Mariana Silva',
    pet: 'adotou o Thor',
    text: 'Adotar pelo CAFOFO foi a melhor decisão. O Thor encheu nossa casa de alegria!',
  },
  {
    name: 'Rafael Costa',
    pet: 'adotou a Mimi',
    text: 'Processo simples e acolhedor. A equipe de voluntários nos ajudou em cada passo.',
  },
  {
    name: 'Juliana Pereira',
    pet: 'adotou o Bob',
    text: 'O Bob foi resgatado das ruas e hoje é da família. Gratidão eterna ao abrigo.',
  },
]

export default function Testimonials() {
  // ── 2. Renderização da Seção ───────────────────────────────────────────
  return (
    <section id="depoimentos" className="bg-brand-50/60 py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Cabeçalho da Seção */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Quem confia, <span className="text-brand-500">recomenda</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Histórias reais de quem abriu o coração e adotou pelo CAFOFO.
          </p>
        </div>

        {/* Grid Animado de Cards */}
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
