import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, Calendar, Rocket, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { getProjects, getEvents, getStartups, getMentors } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../../components/Spinner'
import { formatDate, timeAgo } from '../../utils/helpers'

export default function StudentHome() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentProjects, setRecentProjects] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProjects(), getEvents(), getStartups(), getMentors()])
      .then(([p, e, s, m]) => {
        setStats({ projects: p.data.length, events: e.data.length, startups: s.data.length, mentors: m.data.length })
        setRecentProjects(p.data.slice(0, 4))
        setUpcomingEvents(e.data.slice(0, 3))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const statCards = [
    { label: 'Total Projects', value: stats?.projects, icon: FolderOpen, accent: '#D4AF37' },
    { label: 'Events', value: stats?.events, icon: Calendar, accent: '#22c55e' },
    { label: 'Startups', value: stats?.startups, icon: Rocket, accent: '#f97316' },
    { label: 'Mentors', value: stats?.mentors, icon: Users, accent: '#a78bfa' },
  ]

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1500 0%, #2A2000 50%, #1A1500 100%)', border: '1px solid rgba(212,175,55,0.3)' }}
      >
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'rgba(212,175,55,0.06)' }} />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full translate-y-1/2" style={{ background: 'rgba(212,175,55,0.04)' }} />
        <div className="relative">
          <p className="text-sm mb-1" style={{ color: 'var(--gold)' }}>Welcome back 👋</p>
          <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{user?.college || 'Campus Innovation Hub'}{user?.branch ? ` • ${user.branch}` : ''}</p>
          <Link
            to="/student/projects"
            className="btn-primary inline-flex mt-4"
          >
            <Plus size={15} /> Create Project
          </Link>
        </div>
      </div>

      {/* Stats */}
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
        {/* Recent Projects */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <TrendingUp size={17} style={{ color: 'var(--gold)' }} /> Recent Projects
            </h2>
            <Link to="/student/projects" className="text-xs flex items-center gap-1 transition-colors" style={{ color: 'var(--gold)' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentProjects.length === 0 && <p className="text-sm" style={{ color: 'var(--muted)' }}>No projects yet.</p>}
            {recentProjects.map((p) => (
              <div key={p._id} className="flex items-start gap-3 p-3 rounded-xl transition-colors" style={{ cursor: 'default' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.12)' }}>
                  <FolderOpen size={16} style={{ color: 'var(--gold)' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{p.title}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{p.category} • {timeAgo(p.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Calendar size={17} style={{ color: '#22c55e' }} /> Upcoming Events
            </h2>
            <Link to="/student/events" className="text-xs flex items-center gap-1 transition-colors" style={{ color: 'var(--gold)' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingEvents.length === 0 && <p className="text-sm" style={{ color: 'var(--muted)' }}>No events yet.</p>}
            {upcomingEvents.map((ev) => (
              <div key={ev._id} className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(34,197,94,0.12)' }}>
                  <Calendar size={16} style={{ color: '#22c55e' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{ev.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{formatDate(ev.date)} • {ev.location}</p>
                </div>
                <span className="badge text-xs shrink-0" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>{ev.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
