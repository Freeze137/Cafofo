import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Field, TextInput } from '../components/ui/Field'
import { AuthLayout, Divider, GoogleIcon } from './Login'

// ─────────────────────────────────────────────────────────────────────────
// Tela de Cadastro
//
// Permite a criação de uma nova conta via E-mail/Senha ou Google.
// Reaproveita os componentes visuais do Login (AuthLayout, Divider, etc).
// ─────────────────────────────────────────────────────────────────────────
export default function Register() {
  // ── 1. Estados e Configurações de Rota ─────────────────────────────────
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirma: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── 2. Handlers e Validação ────────────────────────────────────────────
  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe seu nome.'
    if (!form.email.trim()) e.email = 'Informe seu e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido.'
    if (form.senha.length < 6) e.senha = 'A senha deve ter ao menos 6 caracteres.'
    if (form.senha !== form.confirma) e.confirma = 'As senhas não coincidem.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      await register(form.nome, form.email, form.senha)
      navigate('/app', { replace: true })
    } catch (err) {
      setServerError(err.message || 'Não foi possível cadastrar.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
      navigate('/app', { replace: true })
    } catch (err) {
      setServerError(err.message)
    }
  }

  // ── 3. Renderização do Cadastro ────────────────────────────────────────
  return (
    <AuthLayout title="Crie sua conta" subtitle="É rápido, fácil e gratuito 🐶">
      {/* Alerta de erro vindo do servidor */}
      {serverError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</div>
      )}

      {/* Formulário Tradicional */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nome completo" error={errors.nome}>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} />
            <TextInput
              value={form.nome}
              onChange={set('nome')}
              placeholder="Seu nome"
              style={{ paddingLeft: '2.5rem' }}
              error={errors.nome}
            />
          </div>
        </Field>

        <Field label="E-mail" error={errors.email}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} />
            <TextInput
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="voce@email.com"
              style={{ paddingLeft: '2.5rem' }}
              error={errors.email}
            />
          </div>
        </Field>

        {/* Campos de Senha e Confirmação em Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Field label="Confirmar senha" error={errors.confirma}>
            <TextInput
              type="password"
              value={form.confirma}
              onChange={set('confirma')}
              placeholder="••••••"
              error={errors.confirma}
            />
          </Field>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <UserPlus size={18} /> {loading ? 'Cadastrando...' : 'Criar conta'}
        </button>
      </form>

      <Divider />

      {/* Botão de Cadastro Social */}
      <button onClick={handleGoogle} className="btn-ghost w-full">
        <GoogleIcon /> Cadastrar com Google
      </button>

      {/* Links de Rodapé */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Já tem conta?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
