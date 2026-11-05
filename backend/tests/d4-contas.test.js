import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app.js'
import * as db from '../src/db.js'
import { SEED } from '../src/data/seed.js'

// D4 — Senhas ficavam em texto puro no localStorage (issue #9).
// Cadastro e login passam a acontecer na API, com hash bcrypt.

const NOVO = { nome: 'Ana Souza', email: 'Ana@Teste.org ', senha: 'segredo123' }

describe('D4 - cadastro com hash de senha', () => {
  it('T03: grava só o hash bcrypt, diferente da senha enviada', async () => {
    const res = await request(app).post('/api/auth/register').send(NOVO)
    expect(res.status).toBe(201)

    const stored = db.list('users').find((u) => u.email === 'ana@teste.org')
    expect(stored.senha).toBeUndefined()
    expect(stored.senhaHash).not.toBe(NOVO.senha)
    expect(stored.senhaHash).toMatch(/^\$2[aby]\$10\$/)
  })

  it('não devolve o hash na resposta e já entrega o token', async () => {
    const res = await request(app).post('/api/auth/register').send(NOVO)
    expect(res.body.token).toEqual(expect.any(String))
    expect(res.body.user).toMatchObject({ nome: 'Ana Souza', email: 'ana@teste.org' })
    expect(JSON.stringify(res.body)).not.toMatch(/senha/i)
  })

  it('nenhum usuário do seed tem senha em texto puro', () => {
    for (const u of SEED.users) {
      expect(u.senha).toBeUndefined()
      expect(u.senhaHash).toMatch(/^\$2[aby]\$/)
    }
  })

  it('recusa e-mail repetido (409) e dados inválidos (400)', async () => {
    await request(app).post('/api/auth/register').send(NOVO)
    expect((await request(app).post('/api/auth/register').send(NOVO)).status).toBe(409)
    expect((await request(app).post('/api/auth/register').send({ ...NOVO, email: 'x' })).status).toBe(400)
    expect((await request(app).post('/api/auth/register').send({ ...NOVO, email: 'b@c.org', senha: '123' })).status).toBe(400)
    expect((await request(app).post('/api/auth/register').send({ email: 'c@c.org', senha: '123456' })).status).toBe(400)
  })
})

describe('D4 - login na API', () => {
  it('T04: login válido devolve token; senha errada ou e-mail desconhecido → 401', async () => {
    const ok = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@cafofopeludos.com', senha: '123456' })
    expect(ok.status).toBe(200)
    expect(ok.body.token).toEqual(expect.any(String))
    expect(ok.body.user.senhaHash).toBeUndefined()

    const wrong = await request(app).post('/api/auth/login').send({ email: 'demo@cafofopeludos.com', senha: 'errada' })
    expect(wrong.status).toBe(401)
    const unknown = await request(app).post('/api/auth/login').send({ email: 'ninguem@x.org', senha: '123456' })
    expect(unknown.status).toBe(401)
    expect((await request(app).post('/api/auth/login').send({})).status).toBe(401)
  })

  it('GET /api/auth/me devolve o usuário do token e recusa token ausente ou inválido', async () => {
    const { token } = (await request(app).post('/api/auth/login')
      .send({ email: 'DEMO@cafofopeludos.com', senha: '123456' })).body
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)
    expect(me.status).toBe(200)
    expect(me.body).toMatchObject({ id: 'user-demo', email: 'demo@cafofopeludos.com' })
    expect(me.body.senhaHash).toBeUndefined()

    expect((await request(app).get('/api/auth/me')).status).toBe(401)
    expect((await request(app).get('/api/auth/me').set('Authorization', 'Bearer xyz')).status).toBe(401)
  })
})
