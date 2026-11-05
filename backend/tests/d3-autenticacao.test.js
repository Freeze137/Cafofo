import request from 'supertest'
import jwt from 'jsonwebtoken'
import { describe, it, expect } from 'vitest'
import app from '../src/app.js'
import { api, TOKEN } from './helpers.js'

// D3 — A API não exigia autenticação (issue #8).
// Todas as rotas de dados exigem token JWT válido; só /api/health e
// /api/auth (cadastro e login) são públicas.

const ROTAS_DE_DADOS = [
  ['get', '/api/pets'], ['get', '/api/pets/pet-1'], ['post', '/api/pets'],
  ['put', '/api/pets/pet-1'], ['delete', '/api/pets/pet-3'],
  ['get', '/api/volunteers'], ['get', '/api/volunteers/volunteer-1'], ['post', '/api/volunteers'],
  ['put', '/api/volunteers/volunteer-1'], ['delete', '/api/volunteers/volunteer-1'],
  ['get', '/api/adoptions'], ['get', '/api/adoptions/report'], ['get', '/api/adoptions/adoption-1'],
  ['post', '/api/adoptions'], ['put', '/api/adoptions/adoption-1'], ['delete', '/api/adoptions/adoption-1'],
]

describe('D3 - acesso sem token', () => {
  it('T01: POST, PUT e DELETE em /api/pets sem token → 401 e nada muda', async () => {
    expect((await request(app).post('/api/pets').send({ nome: 'Invasor' })).status).toBe(401)
    expect((await request(app).put('/api/pets/pet-1').send({ nome: 'X' })).status).toBe(401)
    expect((await request(app).delete('/api/pets/pet-3')).status).toBe(401)

    const pets = (await api.get('/api/pets')).body
    expect(pets.find((p) => p.id === 'pet-1').nome).toBe('Alex')
    expect(pets.find((p) => p.id === 'pet-3')).toBeTruthy()
    expect(pets.some((p) => p.nome === 'Invasor')).toBe(false)
  })

  it('T02: GET de adoções e voluntários (dados pessoais) sem token → 401', async () => {
    for (const url of ['/api/adoptions', '/api/adoptions/report', '/api/volunteers']) {
      const res = await request(app).get(url)
      expect(res.status, url).toBe(401)
      expect(JSON.stringify(res.body)).not.toMatch(/@|\(11\)/) // nada de e-mail ou telefone
    }
  })

  it('100% das rotas de dados respondem 401 sem token', async () => {
    const abertas = []
    for (const [method, url] of ROTAS_DE_DADOS) {
      const res = await request(app)[method](url).send({})
      if (res.status !== 401) abertas.push(`${method.toUpperCase()} ${url} → ${res.status}`)
    }
    expect(abertas).toEqual([])
  })

  it('token inválido, adulterado ou expirado → 401', async () => {
    const expirado = jwt.sign({ sub: 'user-demo' }, 'outro-segredo', { expiresIn: -10 })
    for (const header of ['Bearer abc', `Bearer ${TOKEN}x`, `Bearer ${expirado}`, TOKEN, 'Basic ZGVtbzox']) {
      expect((await request(app).get('/api/pets').set('Authorization', header)).status, header).toBe(401)
    }
  })
})

describe('D3 - acesso com token', () => {
  it('T05: rota protegida responde 200 com token válido obtido no login', async () => {
    const { token } = (await request(app).post('/api/auth/login')
      .send({ email: 'demo@cafofopeludos.com', senha: '123456' })).body
    const res = await request(app).get('/api/volunteers').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
  })

  it('/api/health continua público', async () => {
    expect((await request(app).get('/api/health')).status).toBe(200)
  })
})
