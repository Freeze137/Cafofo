// ── Field: rótulo + conteúdo + mensagem de erro ──
// Wrapper reutilizável que padroniza a aparência de cada campo de formulário.
export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

// ── TextInput: <input> estilizado (fica vermelho em caso de erro) ──
export function TextInput({ error, ...props }) {
  return (
    <input
      className={`input-field ${error ? 'border-red-300 focus:ring-red-100' : ''}`}
      {...props}
    />
  )
}

// ── Select: <select> estilizado (fica vermelho em caso de erro) ──
export function Select({ error, children, ...props }) {
  return (
    <select
      className={`input-field ${error ? 'border-red-300 focus:ring-red-100' : ''}`}
      {...props}
    >
      {children}
    </select>
  )
}
