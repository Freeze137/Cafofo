import { beforeEach } from 'vitest'
import { reset } from '../src/db.js'

// O banco fica só em memória durante os testes (ver src/db.js), separado
// do banco de desenvolvimento. Cada teste começa com os dados do seed.
beforeEach(() => {
  reset()
})
