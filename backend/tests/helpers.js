import request from 'supertest'
import app from '../src/app.js'
import { signToken } from '../src/auth/token.js'

// Cliente HTTP autenticado para os testes: envia o token da conta demo.
export const TOKEN = signToken({ id: 'user-demo', email: 'demo@cafofopeludos.com' })
const auth = (req) => req.set('Authorization', `Bearer ${TOKEN}`)

export const api = {
  get: (url) => auth(request(app).get(url)),
  post: (url) => auth(request(app).post(url)),
  put: (url) => auth(request(app).put(url)),
  delete: (url) => auth(request(app).delete(url)),
}
