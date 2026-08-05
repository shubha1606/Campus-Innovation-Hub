export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-[3px]', lg: 'w-10 h-10 border-4' }
  return (
    <div
      className={`${s[size]} rounded-full animate-spin ${className}`}
      style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }}
    />
  )
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div
        className="w-10 h-10 border-4 rounded-full animate-spin"
        style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }}
      />
      <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading…</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}
