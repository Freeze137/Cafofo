// ─────────────────────────────────────────────────────────────────────────
// Utilitários de formatação (camada de apresentação)
//
// Funções PURAS reunidas em um único lugar para evitar duplicação (DRY).
// Antes desta extração, `formatDate` estava copiada em AppointmentsPage e
// ReportPage, e a formatação de preço (`Number(x).toFixed(2)`) aparecia
// espalhada em várias páginas. Agora há uma só fonte da verdade.
// ─────────────────────────────────────────────────────────────────────────

// Formata uma data ISO (yyyy-mm-dd) para o padrão brasileiro (dd/mm/aaaa).
// Retorna um travessão quando a data está ausente.
export function formatDate(iso) {
  if (!iso) return '—'
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

// Formata um valor numérico como preço em reais (ex.: "R$ 189.90").
// Tolera valores nulos/indefinidos tratando-os como zero.
export function formatCurrency(value) {
  return `R$ ${Number(value || 0).toFixed(2)}`
}
