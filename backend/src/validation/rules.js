// ─────────────────────────────────────────────────────────────────────────
// Regras de validação reutilizáveis
//
// Cada regra é uma função pequena (body, value, partial) → mensagem | undefined:
//   - lê o campo do corpo da requisição (`body`);
//   - grava o valor limpo em `value`;
//   - devolve uma mensagem de erro quando o dado é inválido.
//
// `createValidator` compõe as regras na ordem dada e para no primeiro erro.
// Os validadores de cada entidade passam a ser apenas uma lista de regras,
// o que mantém a complexidade baixa e facilita testar e incluir regras novas.
// ─────────────────────────────────────────────────────────────────────────

// Único ponto de acesso a campo por nome. Os nomes vêm de constantes do
// código (ex.: 'nome', 'status'), nunca da requisição; por isso o alerta de
// "object injection" do eslint-plugin-security aqui é um falso positivo
// revisado, concentrado em um só lugar em vez de espalhado pelas regras.
const read = (obj, field) => obj[field]
const write = (obj, field, data) => { obj[field] = data }

const has = (body, field) => read(body, field) !== undefined
const trimmed = (body, field) => String(read(body, field)).trim()

/** Compõe uma lista de regras em um validador { value } | { error }. */
export function createValidator(rules) {
  return function validate(body = {}, { partial = false } = {}) {
    const value = {}
    for (const rule of rules) {
      const error = rule(body, value, partial)
      if (error) return { error }
    }
    return { value }
  }
}

/** Texto obrigatório na criação; em atualização parcial, só se enviado. */
export const requiredText = (field, message) => (body, value, partial) => {
  if (has(body, field)) write(value, field, trimmed(body, field))
  if (!partial && !read(value, field)) return message
}

/** Textos opcionais: apara espaços dos que foram enviados. */
export const optionalText = (...fields) => (body, value) => {
  for (const field of fields) {
    if (has(body, field)) write(value, field, trimmed(body, field))
  }
}

/** Texto opcional com valor padrão na criação. */
export const textWithDefault = (field, fallback) => (body, value, partial) => {
  if (has(body, field)) write(value, field, trimmed(body, field))
  else if (!partial) write(value, field, fallback)
}

/** Valor restrito a uma lista, com padrão na criação. */
export const oneOf = (field, allowed, fallback, message) => (body, value, partial) => {
  if (!has(body, field)) {
    if (!partial) write(value, field, fallback)
    return
  }
  const data = read(body, field)
  if (!allowed.includes(data)) return message
  write(value, field, data)
}

/** Repassa o valor sem transformação (ex.: foto em base64 ou null). */
export const passthrough = (field) => (body, value) => {
  if (has(body, field)) write(value, field, read(body, field))
}

/** Converte para booleano, com padrão na criação. */
export const toBoolean = (field, fallback) => (body, value, partial) => {
  if (has(body, field)) write(value, field, Boolean(read(body, field)))
  else if (!partial) write(value, field, fallback)
}

/**
 * Número inteiro dentro de um intervalo. Vazio ou null vira 0 (campo
 * opcional no formulário); qualquer outro valor fora da regra é recusado.
 */
export const integerBetween = (field, min, max, message) => (body, value) => {
  if (!has(body, field)) return
  const raw = read(body, field)
  if (raw === '' || raw === null) {
    write(value, field, 0)
    return
  }
  const number = Number(raw)
  if (!Number.isInteger(number) || number < min || number > max) return message
  write(value, field, number)
}

// Formato simples de e-mail: algo@dominio.ext, sem espaços.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** E-mail opcional: se informado, precisa ter formato válido. */
export const email = (field, message) => (body, value) => {
  if (!has(body, field)) return
  const text = trimmed(body, field)
  if (text && !EMAIL_PATTERN.test(text)) return message
  write(value, field, text)
}
