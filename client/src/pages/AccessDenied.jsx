import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <ShieldOff size={64} className="text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Access Denied</h1>
        <p className="mb-6" style={{ color: 'var(--muted)' }}>You don't have permission to view this page.</p>
        <Link to="/login" className="btn-primary">Go to Login</Link>
      </div>
    </div>
  )
}
