import { seedIfEmpty } from '../services/localDriver'

// ─────────────────────────────────────────────────────────────────────────
// Dados iniciais (seed)
//
// Popula o localStorage na primeira execução para que o sistema já abra
// com conteúdo de demonstração: catálogo de serviços, produtos e alguns
// pets/agendamentos de exemplo. Isso facilita a avaliação (CRUD + JOIN).
// ─────────────────────────────────────────────────────────────────────────

// Catálogo de serviços oferecidos pelo pet shop (entidade do JOIN).
export const SERVICES = [
  { id: 'svc-banho', nome: 'Banho', preco: 60, duracao: 60, icone: 'Droplets' },
  { id: 'svc-tosa', nome: 'Tosa', preco: 80, duracao: 90, icone: 'Scissors' },
  { id: 'svc-hotel', nome: 'Hotelzinho (diária)', preco: 120, duracao: 1440, icone: 'Hotel' },
  { id: 'svc-veterinario', nome: 'Consulta Veterinária', preco: 150, duracao: 45, icone: 'Stethoscope' },
]

export function runSeed() {
  // Serviços (catálogo fixo)
  seedIfEmpty('services', SERVICES)

  // Produtos da lojinha
  seedIfEmpty('products', [
    { id: 'prod-1', nome: 'Ração Premium 10kg', categoria: 'Alimentação', preco: 189.9, estoque: 24, createdAt: new Date().toISOString() },
    { id: 'prod-2', nome: 'Brinquedo Mordedor', categoria: 'Brinquedos', preco: 29.9, estoque: 60, createdAt: new Date().toISOString() },
    { id: 'prod-3', nome: 'Shampoo Neutro 500ml', categoria: 'Higiene', preco: 34.5, estoque: 40, createdAt: new Date().toISOString() },
    { id: 'prod-4', nome: 'Coleira Antipulgas', categoria: 'Saúde', preco: 74.0, estoque: 15, createdAt: new Date().toISOString() },
  ])

  // Pets de demonstração (vinculados ao usuário demo).
  seedIfEmpty('pets', [
    { id: 'pet-1', ownerId: 'user-demo', nome: 'Thor', especie: 'Cachorro', raca: 'Golden Retriever', idade: 3, porte: 'Grande', cor: 'Dourado', createdAt: new Date().toISOString() },
    { id: 'pet-2', ownerId: 'user-demo', nome: 'Mimi', especie: 'Gato', raca: 'Siamês', idade: 2, porte: 'Pequeno', cor: 'Creme', createdAt: new Date().toISOString() },
  ])

  // Agendamentos de demonstração (chaves estrangeiras: petId, serviceId).
  seedIfEmpty('appointments', [
    { id: 'apt-1', ownerId: 'user-demo', petId: 'pet-1', serviceId: 'svc-banho', data: '2026-06-15', hora: '10:00', status: 'Confirmado', createdAt: new Date().toISOString() },
    { id: 'apt-2', ownerId: 'user-demo', petId: 'pet-2', serviceId: 'svc-tosa', data: '2026-06-18', hora: '14:30', status: 'Pendente', createdAt: new Date().toISOString() },
  ])
}
