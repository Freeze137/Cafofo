import { randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'

// ─────────────────────────────────────────────────────────────────────────
// Tokens de sessão (JWT) e middleware de autenticação
//
// O segredo vem da variável de ambiente JWT_SECRET (ver .env.example).
// Sem ela, um segredo aleatório é gerado a cada início do servidor: funciona
// para desenvolvimento, mas as sessões caem quando a API reinicia.
// ─────────────────────────────────────────────────────────────────────────

const SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex')
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h'

if (!process.env.JWT_SECRET && !process.env.VITEST) {
  console.warn('⚠️  JWT_SECRET não definido: usando segredo temporário (sessões expiram ao reiniciar).')
}

/** Gera o token de sessão de um usuário. */
export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, SECRET, { expiresIn: EXPIRES_IN })
}

/** Exige `Authorization: Bearer <token>` válido; senão responde 401. */
export function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Autenticação necessária.' })
  }
  try {
    req.auth = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Sessão inválida ou expirada. Entre novamente.' })
  }
}
