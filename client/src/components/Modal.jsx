import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box ${maxWidth}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
