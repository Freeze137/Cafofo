import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import Testimonials from '../components/landing/Testimonials'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// Página inicial pública (landing page) com todas as seções de marketing.
export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Testimonials />

        {/* Chamada para ação final */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-16 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Pronto para mimar o seu peludo?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-50">
              Crie sua conta gratuitamente e agende o primeiro serviço em poucos cliques.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-lg font-bold text-brand-600 shadow-lg transition hover:-translate-y-0.5"
            >
              Criar conta grátis <ArrowRight size={20} />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
