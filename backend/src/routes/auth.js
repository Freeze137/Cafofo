import { Router } from 'express'
import bcrypt from 'bcryptjs'
import * as db from '../db.js'
import { signToken, requireAuth } from '../auth/token.js'
import { createValidator, requiredText, email } from '../validation/rules.js'

// ─────────────────────────────────────────────────────────────────────────
// Contas de usuário — cadastro, login e sessão atual
//
//   POST /api/auth/register → cria a conta e devolve { token, user }
//   POST /api/auth/login    → valida e-mail/senha e devolve { token, user }
//   GET  /api/auth/me       → dados do usuário do token (requer login)
//
// A senha NUNCA é gravada em texto puro: só o hash bcrypt (custo 10).
// O hash nunca sai da API.
// ─────────────────────────────────────────────────────────────────────────

const COLLECTION = 'users'
const SALT_ROUNDS = 10
const MIN_PASSWORD = 6

const passwordMinLength = (body, value) => {
  const senha = typeof body.senha === 'string' ? body.senha : ''
  if (senha.length < MIN_PASSWORD) return `A senha deve ter ao menos ${MIN_PASSWORD} caracteres.`
  value.senha = senha
}

const validateRegister = createValidator([
  requiredText('nome', 'Informe seu nome.'),
  requiredText('email', 'Informe seu e-mail.'),
  email('email', 'Informe um e-mail válido.'),
  passwordMinLength,
])

const normalizeEmail = (text) => String(text ?? '').trim().toLowerCase()
const findByEmail = (address) => db.list(COLLECTION).find((u) => u.email === address)

// Remove o hash antes de devolver o usuário.
const publicUser = ({ senhaHash: _omit, ...user }) => user

const router = Router()

router.post('/register', (req, res) => {
  const { value, error } = validateRegister(req.body)
  if (error) return res.status(400).json({ error })

  const address = normalizeEmail(value.email)
  if (findByEmail(address)) return res.status(409).json({ error: 'Este e-mail já está cadastrado.' })

  const user = db.create(COLLECTION, {
    nome: value.nome,
    email: address,
    senhaHash: bcrypt.hashSync(value.senha, SALT_ROUNDS),
    photoURL: null,
    createdAt: new Date().toISOString(),
  })
  res.status(201).json({ token: signToken(user), user: publicUser(user) })
})

router.post('/login', (req, res) => {
  const user = findByEmail(normalizeEmail(req.body?.email))
  const senha = typeof req.body?.senha === 'string' ? req.body.senha : ''
  if (!user || !bcrypt.compareSync(senha, user.senhaHash)) {
    return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
  }
  res.json({ token: signToken(user), user: publicUser(user) })
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.getById(COLLECTION, req.auth.sub)
  if (!user) return res.status(401).json({ error: 'Sessão inválida ou expirada. Entre novamente.' })
  res.json(publicUser(user))
})

export default router
