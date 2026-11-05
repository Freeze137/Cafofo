import { describe, it, expect } from 'vitest'
import { validatePet } from '../src/routes/pets.js'
import { validateAdoption } from '../src/routes/adoptions.js'
import { validateVolunteer } from '../src/routes/volunteers.js'

// ─────────────────────────────────────────────────────────────────────────
// Testes de caracterização dos validadores (T13–T16)
//
// Registram o comportamento existente ANTES da refatoração. Eles devem
// continuar passando, sem modificação, depois dela.
// ─────────────────────────────────────────────────────────────────────────

describe('validatePet — caracterização', () => {
  it('T13: aceita um pet válido, apara textos e aplica os padrões', () => {
    const { value, error } = validatePet({
      nome: '  Rex ', especie: ' Cachorro ', raca: ' SRD ', porte: 'Médio',
      sexo: 'Macho', cor: ' Preto ', descricao: ' Dócil ', idade: '3', foto: null, extra: 'x',
    })
    expect(error).toBeUndefined()
    expect(value).toEqual({
      nome: 'Rex', especie: 'Cachorro', raca: 'SRD', porte: 'Médio', sexo: 'Macho',
      cor: 'Preto', descricao: 'Dócil', idade: 3, foto: null, status: 'Disponível',
    })
  })

  it('T14: exige o nome na criação (ausente ou em branco)', () => {
    expect(validatePet({}).error).toBe('O nome do pet é obrigatório.')
    expect(validatePet({ nome: '   ' }).error).toBe('O nome do pet é obrigatório.')
  })

  it('preenche espécie vazia na criação e mantém status informado', () => {
    expect(validatePet({ nome: 'Mia', status: 'Adotado' }).value)
      .toEqual({ nome: 'Mia', especie: '', status: 'Adotado' })
  })

  it('T15: recusa status fora da lista', () => {
    expect(validatePet({ nome: 'Mia', status: 'Vendido' }).error).toBe('Status inválido.')
  })

  it('atualização parcial não exige nome nem aplica padrões', () => {
    expect(validatePet({}, { partial: true }).value).toEqual({})
    expect(validatePet({ status: 'Adotado' }, { partial: true }).value).toEqual({ status: 'Adotado' })
    expect(validatePet({ nome: '' }, { partial: true }).value).toEqual({ nome: '' })
  })

  it('repassa a foto sem alteração', () => {
    expect(validatePet({ nome: 'A', foto: 'data:image/png;base64,AAA' }).value.foto)
      .toBe('data:image/png;base64,AAA')
  })
})

describe('validateAdoption — caracterização', () => {
  it('T13: aceita uma adoção válida e aplica o status padrão', () => {
    const { value, error } = validateAdoption({
      petId: ' pet-1 ', volunteerId: 'volunteer-1', adotante: ' Ana ',
      contato: ' 9999 ', data: '2026-11-05', observacoes: ' ok ',
    })
    expect(error).toBeUndefined()
    expect(value).toEqual({
      petId: 'pet-1', volunteerId: 'volunteer-1', adotante: 'Ana',
      contato: '9999', data: '2026-11-05', observacoes: 'ok', status: 'Em análise',
    })
  })

  it('T14: exige o pet na criação (ausente ou em branco)', () => {
    expect(validateAdoption({}).error).toBe('Selecione o pet a ser adotado.')
    expect(validateAdoption({ petId: '  ' }).error).toBe('Selecione o pet a ser adotado.')
  })

  it('T16: recusa pet ou voluntário inexistente', () => {
    expect(validateAdoption({ petId: 'pet-999' }).error).toBe('Pet informado não existe.')
    expect(validateAdoption({ petId: 'pet-1', volunteerId: 'v-999' }).error)
      .toBe('Voluntário informado não existe.')
  })

  it('aceita voluntário em branco (sem responsável)', () => {
    expect(validateAdoption({ petId: 'pet-1', volunteerId: '' }).value.volunteerId).toBe('')
  })

  it('T15: recusa status fora da lista', () => {
    expect(validateAdoption({ petId: 'pet-1', status: 'Pendente' }).error).toBe('Status inválido.')
  })

  it('atualização parcial não exige pet nem aplica status padrão', () => {
    expect(validateAdoption({}, { partial: true }).value).toEqual({})
    expect(validateAdoption({ status: 'Concluída' }, { partial: true }).value)
      .toEqual({ status: 'Concluída' })
    expect(validateAdoption({ petId: 'pet-999' }, { partial: true }).error)
      .toBe('Pet informado não existe.')
  })
})

describe('validateVolunteer — caracterização', () => {
  it('aceita voluntário válido, apara textos e ativa por padrão', () => {
    expect(validateVolunteer({
      nome: ' Bia ', email: ' bia@cafofo.org ', telefone: ' 1 ', funcao: ' x ', disponibilidade: ' y ',
    }).value).toEqual({
      nome: 'Bia', email: 'bia@cafofo.org', telefone: '1', funcao: 'x', disponibilidade: 'y', ativo: true,
    })
  })

  it('exige o nome na criação', () => {
    expect(validateVolunteer({}).error).toBe('O nome do voluntário é obrigatório.')
    expect(validateVolunteer({ nome: ' ' }).error).toBe('O nome do voluntário é obrigatório.')
  })

  it('converte "ativo" para booleano e não aplica padrão em atualização parcial', () => {
    expect(validateVolunteer({ nome: 'C', ativo: 0 }).value.ativo).toBe(false)
    expect(validateVolunteer({}, { partial: true }).value).toEqual({})
  })
})
