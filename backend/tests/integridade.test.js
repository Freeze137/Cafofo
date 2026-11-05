import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app.js'
import { SEED } from '../src/data/seed.js'

// D1 (issue #6) e D2 (issue #7) — integridade entre pets e adoções.

// Mesma regra de src/routes/adoptions.js (syncPetStatus).
const PET_STATUS_BY_ADOPTION = {
  'Em análise': 'Em processo',
  Aprovada: 'Em processo',
  Concluída: 'Adotado',
  Cancelada: 'Disponível',
}

describe('D1 - dados iniciais consistentes', () => {
  it('T11: o status de cada pet do seed bate com a adoção vinculada', () => {
    const divergencias = SEED.adoptions
      .map((a) => ({ a, pet: SEED.pets.find((p) => p.id === a.petId) }))
      .filter(({ a, pet }) => !pet || pet.status !== PET_STATUS_BY_ADOPTION[a.status])
      .map(({ a, pet }) => `${a.id}: adoção "${a.status}", pet "${pet?.status}"`)
    expect(divergencias).toEqual([])
  })

  it('nenhum pet com adoção "Concluída" aparece como "Disponível" na API', async () => {
    const pets = (await request(app).get('/api/pets')).body
    const adoptions = (await request(app).get('/api/adoptions')).body
    for (const a of adoptions.filter((x) => x.status === 'Concluída')) {
      expect(pets.find((p) => p.id === a.petId).status).toBe('Adotado')
    }
  })
})

describe('D2 - exclusão de pet com adoção vinculada', () => {
  it('T09: responde 409 e preserva o pet e a adoção', async () => {
    const res = await request(app).delete('/api/pets/pet-4')
    expect(res.status).toBe(409)
    expect(res.body.error).toMatch(/adoç/)
    expect((await request(app).get('/api/pets/pet-4')).status).toBe(200)
    expect((await request(app).get('/api/adoptions/adoption-2')).status).toBe(200)
  })

  it('pet sem adoção continua podendo ser excluído', async () => {
    expect((await request(app).delete('/api/pets/pet-12')).status).toBe(204)
    expect((await request(app).get('/api/pets/pet-12')).status).toBe(404)
  })

  it('depois de excluir a adoção, o pet pode ser excluído', async () => {
    await request(app).delete('/api/adoptions/adoption-1')
    expect((await request(app).delete('/api/pets/pet-3')).status).toBe(204)
  })

  it('T12: tentar excluir todos os pets não deixa adoções órfãs no relatório', async () => {
    const pets = (await request(app).get('/api/pets')).body
    for (const p of pets) await request(app).delete(`/api/pets/${p.id}`)
    const report = (await request(app).get('/api/adoptions/report')).body
    expect(report.length).toBe(2)
    expect(report.filter((r) => r.pet === 'Pet removido')).toEqual([])
  })
})
