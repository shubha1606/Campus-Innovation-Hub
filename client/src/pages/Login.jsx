import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Briefcase, Shield } from 'lucide-react'
import { loginUser, loginMentor } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('student')
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      if (tab === 'student' || tab === 'admin') {
        const { data } = await loginUser({ email: form.email, password: form.password })
        if (tab === 'admin' && data.user?.role !== 'admin') { toast.error('Not an admin account'); return }
        if (tab === 'student' && data.user?.role === 'admin') { toast.error('Use Admin login for admin accounts'); return }
        login(data.token, data.user, data.user.role)
        toast.success(`Welcome back, ${data.user.name}!`)
        navigate(data.user.role === 'admin' ? '/admin' : '/student')
      } else {
        const { data } = await loginMentor({ email: form.email, password: form.password })
        login(data.token, data.mentor, 'mentor')
        toast.success(`Welcome back, ${data.mentor.name}!`)
        // force a full navigation to ensure AuthContext loads mentor profile
        window.location.replace('/mentor')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { key: 'student', label: 'Student', icon: GraduationCap },
    { key: 'mentor', label: 'Mentor', icon: Briefcase },
    { key: 'admin', label: 'Admin', icon: Shield },
  ]

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.08) 0%, #0B0B0B 50%, rgba(212,175,55,0.04) 100%)' }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(212,175,55,0.06)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(212,175,55,0.04)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212,175,55,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-md relative fade-in">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 relative"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#FFD700)', boxShadow: '0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15)' }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 4L36 12V20C36 28.837 28.837 36 20 36C11.163 36 4 28.837 4 20V12L20 4Z" fill="#0B0B0B" opacity="0.8"/>
              <path d="M20 10L30 15V20C30 25.523 25.523 30 20 30C14.477 30 10 25.523 10 20V15L20 10Z" fill="#0B0B0B" opacity="0.6"/>
              <circle cx="20" cy="20" r="5" fill="#D4AF37"/>
              <path d="M20 8V15M20 25V32M8 20H15M25 20H32" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-1 gold-gradient-text">Campus Innovation Hub</h1>
          <p className="text-sm tracking-widest" style={{ color: 'var(--muted2)' }}>Innovate • Collaborate • Build the Future</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-7 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(212,175,55,0.08)' }}>
          <p className="text-center text-sm font-medium mb-5" style={{ color: 'var(--muted)' }}>Sign in to your account</p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
                style={tab === key
                  ? { background: 'linear-gradient(135deg,#D4AF37,#FFD700)', color: '#0B0B0B', fontWeight: 700 }
                  : { color: 'var(--muted)' }
                }
              >
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--muted2)' }}
                  onClick={() => setShowPw((s) => !s)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs transition-colors" style={{ color: 'var(--gold)' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : `Sign in as ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
            </button>
          </form>

          {tab !== 'admin' && (
            <p className="text-center text-sm mt-5" style={{ color: 'var(--muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--gold)' }}>
                Register here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
