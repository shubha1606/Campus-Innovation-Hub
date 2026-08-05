import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth()
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3" style={{ background: 'var(--bg)' }}>
      <div
        className="w-10 h-10 border-4 rounded-full animate-spin"
        style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }}
      />
      <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading…</p>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/access-denied" replace />
  return children
}
