import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import {
  Menu, X, Sun, Moon, Search, LogOut, Settings, ChevronDown,
  Home, User, FolderOpen, Calendar, Lightbulb, Users, MessageSquare,
  BarChart3, BookOpen, Rocket, Shield,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import Notifications from '../components/Notifications'
import toast from 'react-hot-toast'

const studentNav = [
  { to: '/student', icon: Home, label: 'Home' },
  { to: '/student/profile', icon: User, label: 'Profile' },
    { to: '/student/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/student/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/student/events', icon: Calendar, label: 'Events' },
  { to: '/student/startups', icon: Rocket, label: 'Startups' },
  { to: '/student/mentors', icon: Users, label: 'Mentors' },
  { to: '/student/team-requests', icon: MessageSquare, label: 'Team Requests' },
  { to: '/student/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/student/settings', icon: Settings, label: 'Settings' },
]

const mentorNav = [
  { to: '/mentor', icon: Home, label: 'Home' },
  { to: '/mentor/profile', icon: User, label: 'My Profile' },
  { to: '/mentor/students', icon: Users, label: 'Students' },
  { to: '/mentor/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/mentor/requests', icon: BookOpen, label: 'Mentorship Requests' },
  { to: '/mentor/events', icon: Calendar, label: 'Events' },
  { to: '/mentor/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/mentor/settings', icon: Settings, label: 'Settings' },
]

const adminNav = [
  { to: '/admin', icon: BarChart3, label: 'Dashboard' },
  { to: '/admin/students', icon: Users, label: 'Manage Students' },
  { to: '/admin/mentors', icon: User, label: 'Manage Mentors' },
  { to: '/admin/projects', icon: FolderOpen, label: 'Manage Projects' },
  { to: '/admin/events', icon: Calendar, label: 'Manage Events' },
  { to: '/admin/startups', icon: Rocket, label: 'Manage Startups' },
  { to: '/admin/settings', icon: Shield, label: 'Settings' },
]

const navMap = { student: studentNav, mentor: mentorNav, admin: adminNav }

const roleBadgeStyle = {
  admin: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  mentor: { background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' },
  student: { background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' },
}

export default function DashboardLayout() {
  const { user, role, logout, lightMode, toggleTheme } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const profileRef = useRef(null)
  const nav = navMap[role] || studentNav

  useEffect(() => {
    const handler = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const roleLabel = role === 'admin' ? 'Admin' : role === 'mentor' ? 'Mentor' : 'Student'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-62 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', width: '248px', minWidth: '248px' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <NavLink to={`/${role}`} className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#FFD700)', boxShadow: '0 0 12px rgba(212,175,55,0.3)' }}
            >
              <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
                <path d="M20 4L36 12V20C36 28.837 28.837 36 20 36C11.163 36 4 28.837 4 20V12L20 4Z" fill="#0B0B0B" opacity="0.8"/>
                <circle cx="20" cy="20" r="5" fill="#0B0B0B"/>
                <path d="M20 8V15M20 25V32M8 20H15M25 20H32" stroke="#0B0B0B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>Campus Hub</p>
              <p className="text-xs truncate" style={{ color: 'var(--muted2)' }}>Innovation Platform</p>
            </div>
          </NavLink>
          <button className="lg:hidden shrink-0" onClick={() => setSidebarOpen(false)}>
            <X size={18} style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <Avatar name={user?.name} src={user?.profileImage} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{user?.name}</p>
              <span className="badge text-xs" style={roleBadgeStyle[role] || roleBadgeStyle.student}>{roleLabel}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/student' || to === '/mentor' || to === '/admin'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            className="sidebar-link w-full"
            style={{ color: '#ef4444' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <button
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text)' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }} />
            <input
              className="input pl-8 py-1.5 text-sm"
              placeholder="Search anything…"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              {lightMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

<Notifications />

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 p-1.5 rounded-lg transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => setProfileOpen((o) => !o)}
              >
                <Avatar name={user?.name} src={user?.profileImage} size="sm" />
                <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--muted)' }} />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-2xl border py-1 z-50 fade-in"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border-gold)', boxShadow: '0 0 30px rgba(212,175,55,0.1)' }}
                >
                  <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{user?.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted2)' }}>{user?.email}</p>
                  </div>
                  <button
                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--text)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => { navigate(`/${role}/profile`); setProfileOpen(false) }}
                  >
                    <User size={14} style={{ color: 'var(--gold)' }} /> Profile
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--text)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => { navigate(`/${role}/settings`); setProfileOpen(false) }}
                  >
                    <Settings size={14} style={{ color: 'var(--gold)' }} /> Settings
                  </button>
                  <div className="my-1" style={{ borderTop: '1px solid var(--border)' }} />
                  <button
                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
