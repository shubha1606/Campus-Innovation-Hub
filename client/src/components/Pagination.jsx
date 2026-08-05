import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, total, perPage = 8, onChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        className="btn-secondary px-2 py-1.5"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="w-8 h-8 rounded-lg text-sm font-medium transition-all"
          style={p === page
            ? { background: 'linear-gradient(135deg,#D4AF37,#FFD700)', color: '#0B0B0B', fontWeight: 700 }
            : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }
          }
        >
          {p}
        </button>
      ))}
      <button
        className="btn-secondary px-2 py-1.5"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
