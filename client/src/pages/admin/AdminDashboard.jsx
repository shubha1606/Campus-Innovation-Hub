import { useEffect, useState } from 'react'
import { Users, FolderOpen, Calendar, Rocket, UserCheck, TrendingUp } from 'lucide-react'
import { getDashboardStats, getProjects, getUsers } from '../../services/api'
import { PageSpinner } from '../../components/Spinner'
import { timeAgo } from '../../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Avatar from '../../components/Avatar'

const GOLD_COLORS = ['#D4AF37', '#FFD700', '#22c55e', '#f97316', '#a78bfa']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border-gold)', color: 'var(--text)' }}>
        <p className="font-medium">{label}</p>
        <p style={{ color: 'var(--gold)' }}>{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentProjects, setRecentProjects] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getProjects(), getUsers()])
      .then(([s, p, u]) => {
        setStats(s.data.stats)
        setRecentProjects(p.data.slice(0, 5))
        setRecentUsers(u.data.slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const barData = [
    { name: 'Users', value: stats?.totalUsers || 0 },
    { name: 'Projects', value: stats?.totalProjects || 0 },
    { name: 'Events', value: stats?.totalEvents || 0 },
    { name: 'Mentors', value: stats?.totalMentors || 0 },
    { name: 'Startups', value: stats?.totalStartups || 0 },
  ]

  const pieData = [
    { name: 'Projects', value: stats?.totalProjects || 0 },
    { name: 'Events', value: stats?.totalEvents || 0 },
    { name: 'Startups', value: stats?.totalStartups || 0 },
    { name: 'Mentors', value: stats?.totalMentors || 0 },
  ]

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, accent: '#D4AF37' },
    { label: 'Projects', value: stats?.totalProjects, icon: FolderOpen, accent: '#22c55e' },
    { label: 'Events', value: stats?.totalEvents, icon: Calendar, accent: '#f97316' },
    { label: 'Mentors', value: stats?.totalMentors, icon: UserCheck, accent: '#a78bfa' },
    { label: 'Startups', value: stats?.totalStartups, icon: Rocket, accent: '#60a5fa' },
  ]

  const roleStyle = (role) => {
    if (role === 'admin') return { background: 'rgba(239,68,68,0.12)', color: '#ef4444' }
    if (role === 'mentor') return { background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }
    return { background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">Admin Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Platform overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <TrendingUp size={17} style={{ color: 'var(--gold)' }} /> Platform Statistics
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={GOLD_COLORS[i % GOLD_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Content Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={GOLD_COLORS[i % GOLD_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: 'var(--muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Recent Projects</h2>
          <div className="space-y-2">
            {recentProjects.map((p) => (
              <div key={p._id} className="flex items-center gap-3 p-2 rounded-lg transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.12)' }}>
                  <FolderOpen size={14} style={{ color: 'var(--gold)' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{p.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{p.createdBy?.name} • {timeAgo(p.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Recent Users</h2>
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Avatar name={u.name} src={u.profileImage} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{u.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted2)' }}>{u.email}</p>
                </div>
                <span className="badge text-xs shrink-0" style={roleStyle(u.role)}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
