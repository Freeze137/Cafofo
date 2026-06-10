import { motion } from 'framer-motion'
import { Droplets, Scissors, Hotel, Stethoscope } from 'lucide-react'

// ── Dados dos serviços oferecidos pelo pet shop ──
const SERVICES = [
  {
    icon: Droplets,
    title: 'Banho',
    desc: 'Banho completo com produtos hipoalergênicos e secagem profissional.',
    price: 'R$ 60',
  },
  {
    icon: Scissors,
    title: 'Tosa',
    desc: 'Tosa higiênica ou na tesoura, do jeitinho que o seu pet merece.',
    price: 'R$ 80',
  },
  {
    icon: Hotel,
    title: 'Hotelzinho',
    desc: 'Hospedagem segura e confortável, com monitoramento e muito carinho.',
    price: 'R$ 120/dia',
  },
  {
    icon: Stethoscope,
    title: 'Veterinário',
    desc: 'Consultas e check-ups com profissionais experientes e atenciosos.',
    price: 'R$ 150',
  },
]

export default function Services() {
  return (
    <section id="servicos" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Nossos <span className="text-brand-500">serviços</span>
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Tudo o que o seu melhor amigo precisa, com qualidade e amor de verdade.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
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
            <p className="mt-4 text-lg font-extrabold text-brand-600">{s.price}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
