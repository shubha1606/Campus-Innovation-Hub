import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <p className="text-8xl font-black text-indigo-500 mb-2">404</p>
        <SearchX size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Page Not Found</h1>
        <p className="mb-6" style={{ color: 'var(--muted)' }}>The page you're looking for doesn't exist.</p>
        <Link to="/login" className="btn-primary">Go Home</Link>
      </div>
    </div>
  )
}
