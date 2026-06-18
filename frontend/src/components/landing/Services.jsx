import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────
// Seção "Como adotar"
//
// Quatro passos do processo de adoção, cada um em um card com IMAGEM no topo
// + texto, animados com Framer Motion.
//
// `fit` controla como a imagem preenche o cabeçalho:
//   • 'cover'   → fotos (preenchem todo o espaço)
//   • 'contain' → ícone/logo com fundo transparente (centralizados, com folga)
//
// As imagens ficam em `public/img/`. Para trocar, basta substituir os arquivos.
// ─────────────────────────────────────────────────────────────────────────

// ── 1. Dados Estáticos ───────────────────────────────────────────────────
const STEPS = [
  {
    title: '1. Conheça os pets',
    desc: 'Veja os animais disponíveis no abrigo e encontre aquele que combina com você.',
    img: '/img/passo-1.png',
    fit: 'contain',
  },
  {
    title: '2. Inicie o processo',
    desc: 'Registre seu interesse e converse com nossa equipe de voluntários.',
    img: '/img/passo-2.jpg',
    fit: 'cover',
  },
  {
    title: '3. Visita e aprovação',
    desc: 'Agende uma visita ao abrigo e finalize o processo com tranquilidade.',
    img: '/img/passo-3.png',
    fit: 'contain',
  },
  {
    title: '4. Leve para casa',
    desc: 'Adoção concluída! Seu novo amigo ganha um lar cheio de amor.',
    img: '/img/passo-4.jpg',
    fit: 'cover',
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
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-soft"
          >
            {/* Imagem do passo */}
            <div className="flex h-44 items-center justify-center overflow-hidden bg-brand-50">
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className={
                  s.fit === 'cover'
                    ? 'h-full w-full object-cover transition duration-500 group-hover:scale-105'
                    : 'h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105'
                }
              />
            </div>

            {/* Texto do passo */}
            <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
              <h3 className="text-xl font-bold text-slate-800">{s.title}</h3>
              <p className="mt-2 text-slate-500">{s.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
