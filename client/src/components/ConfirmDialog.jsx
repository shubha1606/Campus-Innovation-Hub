import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm', message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex gap-3 mb-5">
        <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{message}</p>
      </div>
      <div className="flex gap-2 justify-end">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  )
}
