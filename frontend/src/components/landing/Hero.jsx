import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, Heart, Sparkles, ArrowRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────
// Hero Section
//
// Primeira dobra (acima da linha de rolagem) da Landing Page.
// Contém a principal chamada para ação (CTA), título de impacto, texto
// persuasivo e uma ilustração animada para prender a atenção do usuário.
// ─────────────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ── 1. Fundo Decorativo ─────────────────────────────────────────── */}
      {/* Círculos coloridos e desfocados (blobs) posicionados em absolute. */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        
        {/* ── 2. Conteúdo de Texto (Esquerda) ───────────────────────────── */}
        {/* Textos e botões que entram deslizando da esquerda para a direita. */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700">
            <Sparkles size={16} /> Um lar para cada animal
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
            Adote um <span className="text-brand-500">amigo</span> e transforme duas vidas
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-600">
            Conheça os animais resgatados do abrigo CAFOFO e dê a eles a chance de
            um novo lar. Adotar é simples, gratuito e cheio de amor.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary text-lg">
              Quero adotar <ArrowRight size={20} />
            </Link>
            <a href="#como-adotar" className="btn-ghost text-lg">
              Como funciona
            </a>
          </div>

          {/* Métricas de prova social */}
          <div className="mt-10 flex items-center gap-8">
            <Stat value="+500" label="Adoções felizes" />
            <Stat value="+80" label="Voluntários" />
            <Stat value="+8 anos" label="De resgate" />
          </div>
        </motion.div>

        {/* ── 3. Ilustração Animada (Direita) ───────────────────────────── */}
        {/* Bloco visual contendo o logo/ícone e selos de qualidade orbitando. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex justify-center"
        >
          <div className="relative flex h-80 w-80 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-brand-400 to-brand-600 shadow-2xl sm:h-96 sm:w-96">
            <PawPrint className="animate-float text-white/90" size={160} strokeWidth={1.5} />
            <FloatingBadge className="-left-6 top-10" icon={Heart} text="100% Amor" />
            <FloatingBadge className="-right-4 bottom-12" icon={Sparkles} text="Adoção responsável" delay={0.3} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── 4. Subcomponente: Stat (Estatísticas) ────────────────────────────────
// Componente puramente visual para exibir os números de destaque (ex: +2.5k).
function Stat({ value, label }) {
  return (
    <div>
      <p className="text-2xl font-extrabold text-brand-600">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

// ── 5. Subcomponente: FloatingBadge (Selos Flutuantes) ───────────────────
// Selos pequenos com ícone e texto que surgem com um atraso (delay) ao redor da ilustração.
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
