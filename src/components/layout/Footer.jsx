import { PawPrint, Instagram, Facebook, Mail, MapPin } from 'lucide-react'

// Rodapé institucional da landing page.
export default function Footer() {
  return (
    <footer id="sobre" className="border-t border-brand-100 bg-brand-900 text-brand-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-extrabold">
            <span className="rounded-xl bg-brand-500 p-2 text-white">
              <PawPrint size={22} />
            </span>
            CAFOFOPELUDOS
          </div>
          <p className="mt-4 max-w-xs text-brand-200">
            Cuidamos do seu melhor amigo com carinho, profissionalismo e muito amor.
            Banho, tosa, hotelzinho e muito mais.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-bold">Contato</h4>
          <ul className="space-y-3 text-brand-200">
            <li className="flex items-center gap-2">
              <Mail size={18} /> contato@cafofopeludos.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} /> Rua dos Pets, 123 — Centro
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold">Redes sociais</h4>
          <div className="flex gap-3">
            {[Instagram, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-xl bg-brand-800 p-3 transition hover:bg-brand-500"
                aria-label="Rede social"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-brand-800 py-5 text-center text-sm text-brand-300">
        © {new Date().getFullYear()} CAFOFOPELUDOS. Todos os direitos reservados. 🐾
      </div>
    </footer>
  )
}
