import { useAuth } from '../../context/AuthContext'
import { Sun, Moon, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { lightMode, toggleTheme } = useAuth()

  return (
    <div className="max-w-xl mx-auto space-y-5 fade-in">
      <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Admin Settings</h1>

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {lightMode ? <Sun size={18} style={{ color: '#FFD700' }} /> : <Moon size={18} style={{ color: 'var(--gold)' }} />}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{lightMode ? 'Light Mode' : 'Dark Mode'}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Toggle between light and dark theme</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-11 h-6 rounded-full transition-all"
            style={{ background: lightMode ? 'var(--border)' : 'linear-gradient(135deg,#D4AF37,#FFD700)' }}
          >
            <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ left: lightMode ? '2px' : '22px' }} />
          </button>
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <Shield size={16} className="text-red-400" /> System
        </h2>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Admin credentials are managed directly in MongoDB. Use a database client to update admin credentials.
        </p>
        <button
          className="btn-secondary text-sm"
          onClick={() => toast.success('System info logged to console')}
        >
          View System Info
        </button>
      </div>
    </div>
  )
}
