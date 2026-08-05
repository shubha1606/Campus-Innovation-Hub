import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, FolderOpen, Calendar, BookOpen, ArrowRight, TrendingUp } from 'lucide-react'
import { getUsers, getProjects, getEvents, getBookings } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../../components/Spinner'
import { formatDate, timeAgo } from '../../utils/helpers'
import Avatar from '../../components/Avatar'

export default function MentorHome() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentProjects, setRecentProjects] = useState([])
  const [pendingBookings, setPendingBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUsers(), getProjects(), getEvents(), getBookings({ mentorId: user?._id })])
      .then(([u, p, e, b]) => {
        setStats({ students: u.data.filter((x) => x.role === 'student').length, projects: p.data.length, events: e.data.length, requests: b.data.length })
        setRecentProjects(p.data.slice(0, 4))
        setPendingBookings(b.data.slice(0, 3))
      })
      .finally(() => setLoading(false))
  }, [user?._id])

  if (loading) return <PageSpinner />

  const statCards = [
    { label: 'Students', value: stats?.students, icon: Users, accent: '#D4AF37' },
    { label: 'Projects', value: stats?.projects, icon: FolderOpen, accent: '#22c55e' },
    { label: 'Events', value: stats?.events, icon: Calendar, accent: '#f97316' },
    { label: 'Requests', value: stats?.requests, icon: BookOpen, accent: '#a78bfa' },
  ]

  const statusStyle = (s) => {
    if (s === 'approved') return { background: 'rgba(34,197,94,0.12)', color: '#22c55e' }
    if (s === 'rejected') return { background: 'rgba(239,68,68,0.12)', color: '#ef4444' }
    return { background: 'rgba(234,179,8,0.12)', color: '#eab308' }
  }

  return (
    <div className="space-y-6 fade-in">
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1500 0%, #2A2000 50%, #1A1500 100%)', border: '1px solid rgba(212,175,55,0.3)' }}
      >
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'rgba(212,175,55,0.06)' }} />
        <div className="relative">
          <p className="text-sm mb-1" style={{ color: 'var(--gold)' }}>Welcome back 👋</p>
          <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{user?.company || 'Mentor'}{user?.experience ? ` • ${user.experience} yrs experience` : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="stat-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18` }}>
              <Icon size={20} style={{ color: accent }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value ?? '—'}</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <TrendingUp size={17} style={{ color: 'var(--gold)' }} /> Recent Projects
            </h2>
            <Link to="/mentor/projects" className="text-xs flex items-center gap-1" style={{ color: 'var(--gold)' }}>View all <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {recentProjects.length === 0 && <p className="text-sm" style={{ color: 'var(--muted)' }}>No projects yet.</p>}
            {recentProjects.map((p) => (
              <div key={p._id} className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.12)' }}>
                  <FolderOpen size={16} style={{ color: 'var(--gold)' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{p.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{p.createdBy?.name} • {timeAgo(p.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <BookOpen size={17} style={{ color: '#a78bfa' }} /> Mentorship Requests
            </h2>
            <Link to="/mentor/requests" className="text-xs flex items-center gap-1" style={{ color: 'var(--gold)' }}>View all <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {pendingBookings.length === 0 && <p className="text-sm" style={{ color: 'var(--muted)' }}>No requests yet.</p>}
            {pendingBookings.map((b) => (
              <div key={b._id} className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Avatar name={b.student?.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{b.student?.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{b.topic} • {formatDate(b.date)}</p>
                </div>
                <span className="badge text-xs shrink-0" style={statusStyle(b.status)}>{b.status || 'pending'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
