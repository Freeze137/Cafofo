import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app.js'
import { validatePet } from '../src/routes/pets.js'
import { validateVolunteer } from '../src/routes/volunteers.js'

// D5 — A API aceitava idade negativa e e-mail inválido (issue #10).

describe('D5 - idade do pet', () => {
  it('T07: recusa idade negativa, fracionada, acima do limite ou não numérica', async () => {
    for (const idade of [-3, 2.5, 31, 'abc']) {
      const res = await request(app).post('/api/pets').send({ nome: 'X', idade })
      expect(res.status, `idade ${idade}`).toBe(400)
      expect(res.body.error).toMatch(/idade/i)
    }
  })

  it('aceita idade válida (inclusive em texto) e trata vazio como 0', () => {
    expect(validatePet({ nome: 'A', idade: '4' }).value.idade).toBe(4)
    expect(validatePet({ nome: 'A', idade: 0 }).value.idade).toBe(0)
    expect(validatePet({ nome: 'A', idade: '' }).value.idade).toBe(0)
    expect(validatePet({ nome: 'A', idade: null }).value.idade).toBe(0)
  })

  it('recusa idade inválida também na atualização', async () => {
    const res = await request(app).put('/api/pets/pet-1').send({ idade: -1 })
    expect(res.status).toBe(400)
  })
})

describe('D5 - e-mail do voluntário', () => {
  it('T08: recusa e-mail sem formato válido', async () => {
    for (const email of ['abc', 'a@b', 'a b@c.com', '@cafofo.org']) {
      const res = await request(app).post('/api/volunteers').send({ nome: 'Y', email })
      expect(res.status, `e-mail ${email}`).toBe(400)
      expect(res.body.error).toBe('Informe um e-mail válido.')
    }
  })

  it('aceita e-mail válido (aparado) ou vazio', () => {
    expect(validateVolunteer({ nome: 'Y', email: ' y@cafofo.org ' }).value.email).toBe('y@cafofo.org')
    expect(validateVolunteer({ nome: 'Y', email: '' }).value.email).toBe('')
  })
})
