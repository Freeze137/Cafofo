// ─────────────────────────────────────────────────────────────────────────
// Tratador central de erros
//
// Qualquer erro que chegue ao Express (JSON malformado, corpo grande demais,
// exceção numa rota) é respondido em JSON, com mensagem amigável e SEM
// stack trace nem caminhos internos do servidor. O detalhe técnico dos
// erros 500 fica só no log do servidor.
// ─────────────────────────────────────────────────────────────────────────

// Mensagens para os erros conhecidos do body-parser (express.json).
const MESSAGES = {
  'entity.parse.failed': 'JSON inválido no corpo da requisição.',
  'entity.too.large': 'Corpo da requisição muito grande.',
}

// O Express reconhece o tratador de erros pelos 4 parâmetros.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = Number(err.status ?? err.statusCode) || 500
  const isClientError = status >= 400 && status < 500

  if (!isClientError) console.error(err)

  const fallback = isClientError ? 'Requisição inválida.' : 'Erro interno do servidor.'
  res.status(isClientError ? status : 500).json({ error: MESSAGES[err.type] ?? fallback })
}
