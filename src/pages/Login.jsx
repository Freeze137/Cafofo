import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Field, TextInput } from '../components/ui/Field'

// ─────────────────────────────────────────────────────────────────────────
// Tela de Login
//
// Permite a entrada de usuários existentes via E-mail/Senha ou Google.
// Redireciona o usuário para a página de onde ele veio após o login.
// ─────────────────────────────────────────────────────────────────────────
export default function Login() {
  // ── 1. Estados e Configurações de Rota ─────────────────────────────────
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/app'

  const [form, setForm] = useState({ email: '', senha: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── 2. Handlers e Validação ────────────────────────────────────────────
  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Informe seu e-mail.'
    if (!form.senha) e.senha = 'Informe sua senha.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.senha)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message || 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setServerError('')
    try {
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message || 'Falha no login com Google.')
    }
  }

  // ── 3. Renderização do Login ───────────────────────────────────────────
  return (
    <AuthLayout title="Bem-vindo de volta!" subtitle="Entre para cuidar do seu peludo 🐾">
      {/* Alerta de erro vindo do servidor ou local */}
      {serverError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</div>
      )}

      {/* Formulário Tradicional */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="E-mail" error={errors.email}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} />
            <TextInput
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="voce@email.com"
              className="input-field pl-10"
              style={{ paddingLeft: '2.5rem' }}
              error={errors.email}
            />
          </div>
        </Field>

        <Field label="Senha" error={errors.senha}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} />
            <TextInput
              type="password"
              value={form.senha}
              onChange={set('senha')}
              placeholder="••••••"
              style={{ paddingLeft: '2.5rem' }}
              error={errors.senha}
            />
          </div>
        </Field>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <LogIn size={18} /> {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <Divider />

      {/* Botão de Login Social */}
      <button onClick={handleGoogle} className="btn-ghost w-full">
        <GoogleIcon /> Entrar com Google
      </button>

      {/* Links de Rodapé */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Ainda não tem conta?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:underline">
          Cadastre-se
        </Link>
      </p>

      <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-center text-xs text-brand-700">
        💡 Conta demo: <strong>demo@cafofopeludos.com</strong> / <strong>123456</strong>
      </p>
    </AuthLayout>
  )
}

// ── 4. Subcomponente: AuthLayout ─────────────────────────────────────────
// Layout base que contém o fundo animado, logo centralizada e o cartão branco.
// Exportado para ser reaproveitado no Register.jsx.
export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-cream to-brand-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-2xl font-extrabold text-brand-700">
          <span className="rounded-xl bg-brand-500 p-2 text-white shadow-soft">
            <PawPrint size={24} />
          </span>
          CAFOFOPELUDOS
        </Link>
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
          <p className="mb-6 mt-1 text-slate-500">{subtitle}</p>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// ── 5. Subcomponente: Divider ────────────────────────────────────────────
// Linha divisória visual com texto "ou".
export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-sm text-slate-400">
      <span className="h-px flex-1 bg-slate-200" /> ou <span className="h-px flex-1 bg-slate-200" />
    </div>
  )
}

// ── 6. Subcomponente: GoogleIcon ─────────────────────────────────────────
// Ícone SVG otimizado do Google (não recarrega bibliotecas externas).
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16 3 9.1 7.6 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36 26.7 37 24 37c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.1 42.3 16 45 24 45z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  )
}
