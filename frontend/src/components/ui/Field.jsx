// Campo de formulário reutilizável (label + input/select) com mensagem de erro.
export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

export function TextInput({ error, ...props }) {
  return (
    <input
      className={`input-field ${error ? 'border-red-300 focus:ring-red-100' : ''}`}
      {...props}
    />
  )
}

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
