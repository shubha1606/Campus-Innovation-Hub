import { useAuth } from '../../context/AuthContext'
import { Sun, Moon, Bell, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StudentSettings() {
  const { lightMode, toggleTheme } = useAuth()

  return (
    <div className="max-w-xl mx-auto space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Manage your preferences</p>
      </div>

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
            <span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
              style={{ left: lightMode ? '2px' : '22px' }}
            />
          </button>
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Notifications</h2>
        {[
          { label: 'Email Notifications', desc: 'Receive updates via email' },
          { label: 'Project Invitations', desc: 'Get notified when invited to projects' },
          { label: 'Mentor Responses', desc: 'Get notified when mentors respond' },
        ].map(({ label, desc }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={16} style={{ color: 'var(--gold)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{desc}</p>
              </div>
            </div>
            <button
              onClick={() => toast.success('Preference saved')}
              className="relative w-11 h-6 rounded-full transition-all"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#FFD700)' }}
            >
              <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow" />
            </button>
          </div>
        ))}
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <Shield size={16} style={{ color: '#ef4444' }} /> Danger Zone
        </h2>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>These actions are irreversible. Please be careful.</p>
        <button className="btn-danger text-sm" onClick={() => toast.error('Contact admin to delete your account')}>
          Delete Account
        </button>
      </div>
    </div>
  )
}
