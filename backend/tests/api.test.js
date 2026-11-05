import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app.js'

// Testes de fumaça da API: garantem que os três CRUDs e o relatório
// respondem como antes das mudanças da Parte 2.

describe('API — infraestrutura', () => {
  it('GET /api/health responde ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('rota desconhecida responde 404 em JSON', async () => {
    const res = await request(app).get('/api/nao-existe')
    expect(res.status).toBe(404)
    expect(res.body.error).toBeTruthy()
  })
})

describe('CRUD de voluntários', () => {
  it('cria, busca, atualiza e remove um voluntário', async () => {
    const created = await request(app)
      .post('/api/volunteers')
      .send({ nome: 'Ana Teste', email: 'ana@teste.org' })
    expect(created.status).toBe(201)
    expect(created.body.ativo).toBe(true)
    const id = created.body.id

    const found = await request(app).get(`/api/volunteers/${id}`)
    expect(found.body.nome).toBe('Ana Teste')

    const updated = await request(app).put(`/api/volunteers/${id}`).send({ ativo: false })
    expect(updated.status).toBe(200)
    expect(updated.body.ativo).toBe(false)

    const removed = await request(app).delete(`/api/volunteers/${id}`)
    expect(removed.status).toBe(204)
    expect((await request(app).get(`/api/volunteers/${id}`)).status).toBe(404)
  })

  it('PUT e DELETE em id inexistente respondem 404', async () => {
    expect((await request(app).put('/api/volunteers/x').send({ nome: 'X' })).status).toBe(404)
    expect((await request(app).delete('/api/volunteers/x')).status).toBe(404)
  })
})

describe('Adoções — regra de negócio', () => {
  it('T10: concluir uma adoção muda o pet para "Adotado"', async () => {
    const adoption = await request(app)
      .post('/api/adoptions')
      .send({ petId: 'pet-1', volunteerId: 'volunteer-1', adotante: 'Teste' })
    expect(adoption.status).toBe(201)
    expect((await request(app).get('/api/pets/pet-1')).body.status).toBe('Em processo')

    await request(app).put(`/api/adoptions/${adoption.body.id}`).send({ status: 'Concluída' })
    expect((await request(app).get('/api/pets/pet-1')).body.status).toBe('Adotado')
  })

  it('cancelar uma adoção devolve o pet para "Disponível"', async () => {
    const adoption = await request(app).post('/api/adoptions').send({ petId: 'pet-2' })
    await request(app).put(`/api/adoptions/${adoption.body.id}`).send({ status: 'Cancelada' })
    expect((await request(app).get('/api/pets/pet-2')).body.status).toBe('Disponível')
  })

  it('relatório cruza adoção, pet e voluntário', async () => {
    const res = await request(app).get('/api/adoptions/report')
    expect(res.status).toBe(200)
    const row = res.body.find((r) => r.id === 'adoption-2')
    expect(row).toMatchObject({ pet: 'Rosa', voluntario: 'Mariana Silva', status: 'Concluída' })
  })

  it('lista e busca adoções; id inexistente responde 404', async () => {
    expect((await request(app).get('/api/adoptions')).body.length).toBe(2)
    expect((await request(app).get('/api/adoptions/adoption-1')).body.petId).toBe('pet-3')
    expect((await request(app).get('/api/adoptions/x')).status).toBe(404)
    expect((await request(app).put('/api/adoptions/x').send({})).status).toBe(404)
    expect((await request(app).delete('/api/adoptions/x')).status).toBe(404)
  })
})
