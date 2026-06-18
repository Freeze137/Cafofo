// ─────────────────────────────────────────────────────────────────────────
// Dados iniciais (seed) — Sistema de Adoção de Animais
//
// Popula o "banco" (arquivo JSON) na primeira execução para que a API já
// responda com conteúdo de demonstração. Cobre as três entidades do sistema:
//
//   • pets        → animais do abrigo disponíveis para adoção
//   • volunteers  → equipe de voluntários que ajuda no local
//   • adoptions   → processos de adoção (vinculam um pet a um voluntário
//                   responsável via chaves estrangeiras petId / volunteerId)
//
// Isso facilita a avaliação imediata dos três CRUDs e do relatório (JOIN).
// ─────────────────────────────────────────────────────────────────────────

const now = () => new Date().toISOString()

export const SEED = {
  // ── Pets (CRUD 1) ──────────────────────────────────────────────────────
  // O campo `status` controla a disponibilidade para adoção:
  // 'Disponível' | 'Em processo' | 'Adotado'.
  pets: [
    { id: 'pet-1', nome: 'Thor', especie: 'Cachorro', raca: 'Golden Retriever', idade: 3, porte: 'Grande', sexo: 'Macho', cor: 'Dourado', descricao: 'Dócil, brincalhão e ótimo com crianças.', status: 'Disponível', createdAt: now() },
    { id: 'pet-2', nome: 'Mimi', especie: 'Gato', raca: 'Siamês', idade: 2, porte: 'Pequeno', sexo: 'Fêmea', cor: 'Creme', descricao: 'Carinhosa e independente, adora um colo no fim do dia.', status: 'Disponível', createdAt: now() },
    { id: 'pet-3', nome: 'Bob', especie: 'Cachorro', raca: 'Vira-lata', idade: 5, porte: 'Médio', sexo: 'Macho', cor: 'Caramelo', descricao: 'Calmo e companheiro, resgatado das ruas.', status: 'Em processo', createdAt: now() },
    { id: 'pet-4', nome: 'Nina', especie: 'Gato', raca: 'Persa', idade: 1, porte: 'Pequeno', sexo: 'Fêmea', cor: 'Branco', descricao: 'Filhote cheia de energia procurando um lar.', status: 'Adotado', createdAt: now() },
  ],

  // ── Voluntários (CRUD 3) ───────────────────────────────────────────────
  // Equipe que cuida do abrigo. `funcao` descreve a área de atuação.
  volunteers: [
    { id: 'volunteer-1', nome: 'Mariana Silva', email: 'mariana@cafofo.org', telefone: '(11) 98888-1010', funcao: 'Cuidados gerais', disponibilidade: 'Fins de semana', ativo: true, createdAt: now() },
    { id: 'volunteer-2', nome: 'Juliana Pereira', email: 'juliana@cafofo.org', telefone: '(11) 97777-2020', funcao: 'Coordenação de adoções', disponibilidade: 'Seg/Qua/Sex', ativo: true, createdAt: now() },
  ],

  // ── Adoções (CRUD 2) ───────────────────────────────────────────────────
  // Processos de adoção. Chaves estrangeiras: petId, volunteerId.
  // `adotante` guarda os dados de quem está adotando o animal.
  adoptions: [
    { id: 'adoption-1', petId: 'pet-3', volunteerId: 'volunteer-2', adotante: 'Carlos Mendes', contato: '(11) 96666-3030', data: '2026-06-10', status: 'Em análise', observacoes: 'Visita ao abrigo agendada.', createdAt: now() },
    { id: 'adoption-2', petId: 'pet-4', volunteerId: 'volunteer-1', adotante: 'Fernanda Lopes', contato: '(11) 95555-4040', data: '2026-05-28', status: 'Concluída', observacoes: 'Adoção finalizada com sucesso.', createdAt: now() },
  ],
}
