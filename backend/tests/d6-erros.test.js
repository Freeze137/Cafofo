import { describe, it, expect, vi } from 'vitest'
import { api } from './helpers.js'
import { errorHandler } from '../src/middleware/errorHandler.js'

// D6 — JSON malformado devolvia página HTML com stack trace (issue #11).

const INTERNAL_DETAILS = /node_modules|SyntaxError|\bat \w|[A-Z]:\\|\/home\/|\/src\//

describe('D6 - JSON malformado', () => {
  it('T06: responde 400 em JSON, sem stack trace nem caminhos internos', async () => {
    const res = await api
      .post('/api/pets')
      .set('Content-Type', 'application/json')
      .send('{nome:')
    expect(res.status).toBe(400)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toEqual({ error: 'JSON inválido no corpo da requisição.' })
    expect(res.text).not.toMatch(INTERNAL_DETAILS)
  })
})

describe('tratador central de erros', () => {
  const fakeRes = () => {
    const res = {}
    res.status = vi.fn(() => res)
    res.json = vi.fn(() => res)
    return res
  }

  it('erro inesperado vira 500 genérico, sem expor a mensagem interna', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = fakeRes()
    errorHandler(new Error('falha em /home/app/src/db.js'), {}, res, () => {})
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor.' })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('erro 4xx conhecido mantém o status e usa mensagem amigável', () => {
    const res = fakeRes()
    errorHandler({ status: 413, type: 'entity.too.large' }, {}, res, () => {})
    expect(res.status).toHaveBeenCalledWith(413)
    expect(res.json).toHaveBeenCalledWith({ error: 'Corpo da requisição muito grande.' })
  })

  it('erro 4xx desconhecido usa mensagem genérica', () => {
    const res = fakeRes()
    errorHandler({ statusCode: 415 }, {}, res, () => {})
    expect(res.status).toHaveBeenCalledWith(415)
    expect(res.json).toHaveBeenCalledWith({ error: 'Requisição inválida.' })
  })
})
