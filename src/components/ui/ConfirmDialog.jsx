import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

// Diálogo de confirmação para ações destrutivas (ex.: excluir registro).
export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirmar exclusão'}>
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-red-100 p-3 text-red-500">
          <AlertTriangle size={24} />
        </div>
        <p className="pt-1 text-slate-600">
          {message || 'Tem certeza? Esta ação não poderá ser desfeita.'}
        </p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="btn-ghost">
          Cancelar
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200"
        >
          Excluir
        </button>
      </div>
    </Modal>
  )
}
