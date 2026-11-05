import { defineConfig } from 'vitest/config'

// Configuração dos testes do backend (Vitest + Supertest).
export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    // Os arquivos compartilham o mesmo banco em arquivo: execução sequencial.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      // seed.js é dado estático e server.js só chama listen().
      exclude: ['src/data/**', 'src/server.js'],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
})
