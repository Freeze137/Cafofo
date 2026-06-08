import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, Heart, Sparkles, ArrowRight } from 'lucide-react'

// Hero Section da landing page — chamada para ação principal.
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Blobs decorativos */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700">
            <Sparkles size={16} /> O melhor cafofo para o seu pet
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
            Cuidado e carinho que seu <span className="text-brand-500">peludo</span> merece
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-600">
            Banho, tosa e hotelzinho com toda a dedicação. Agende serviços, gerencie
            seus pets e acompanhe tudo em um só lugar.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary text-lg">
              Comece agora <ArrowRight size={20} />
            </Link>
            <a href="#servicos" className="btn-ghost text-lg">
              Ver serviços
            </a>
          </div>

          <div className="mt-10 flex items-center gap-8">
            <Stat value="+2.5k" label="Pets felizes" />
            <Stat value="4.9★" label="Avaliação" />
            <Stat value="+8 anos" label="De experiência" />
          </div>
        </motion.div>

        {/* Ilustração */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex justify-center"
        >
          <div className="relative flex h-80 w-80 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-brand-400 to-brand-600 shadow-2xl sm:h-96 sm:w-96">
            <PawPrint className="animate-float text-white/90" size={160} strokeWidth={1.5} />
            <FloatingBadge className="-left-6 top-10" icon={Heart} text="100% Amor" />
            <FloatingBadge className="-right-4 bottom-12" icon={Sparkles} text="Tosa Pet" delay={0.3} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-2xl font-extrabold text-brand-600">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

function FloatingBadge({ className, icon: Icon, text, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + delay }}
      className={`absolute flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl ${className}`}
    >
      <span className="rounded-full bg-brand-100 p-1.5 text-brand-500">
        <Icon size={16} />
      </span>
      <span className="text-sm font-bold text-slate-700">{text}</span>
    </motion.div>
  )
}
