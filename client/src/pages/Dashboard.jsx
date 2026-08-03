import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Dashboard.css'

const stats = [
  { label: 'Total Projects', value: '128', emoji: '📁' },
  { label: 'Active Teams', value: '47', emoji: '👥' },
  { label: 'Upcoming Events', value: '12', emoji: '📅' },
  { label: 'Registered Users', value: '1,340', emoji: '🎓' },
]

const recentProjects = [
  {
    title: 'AI Campus Assistant',
    category: 'Artificial Intelligence',
    desc: 'A smart chatbot that helps students navigate campus resources and FAQs using NLP.',
    team: 'Team Nexus',
  },
  {
    title: 'EcoTrack Dashboard',
    category: 'Sustainability',
    desc: 'Real-time dashboard tracking campus energy consumption with eco-friendly suggestions.',
    team: 'Green Coders',
  },
  {
    title: 'Student Skill Exchange',
    category: 'EdTech',
    desc: 'Peer-to-peer platform where students teach and learn skills from each other.',
    team: 'SkillBridge',
  },
  {
    title: 'Smart Waste Monitor',
    category: 'IoT',
    desc: 'Sensor-based waste bin monitoring with route optimization for campus staff.',
    team: 'IoT Innovators',
  },
]

const sidebarLinks = [
  { to: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { to: '/showcase', label: 'Projects', emoji: '📁' },
  { to: '/find-teammates', label: 'Teams', emoji: '👥' },
  { to: '/hackathons', label: 'Events', emoji: '📅' },
  { to: '/profile', label: 'Profile', emoji: '👤' },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dashboard-layout">

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Menu</span>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          {sidebarLinks.map(({ to, label, emoji }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-emoji">{emoji}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">

        {/* Mobile sidebar toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          ☰ Menu
        </button>

        {/* Welcome */}
        <section className="dash-welcome">
          <div>
            <h1>Welcome to Campus Innovation Hub 👋</h1>
            <p>Discover projects, connect with teammates, join hackathons, and showcase your work — all in one place.</p>
          </div>
        </section>

        {/* Stats */}
        <section className="dash-stats">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <span className="stat-emoji">{s.emoji}</span>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="dash-section">
          <h2 className="dash-section-title">Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/ideas" className="qa-btn qa-primary">＋ Add Project</Link>
            <Link to="/showcase" className="qa-btn qa-secondary">Browse Projects</Link>
            <Link to="/profile" className="qa-btn qa-secondary">My Profile</Link>
          </div>
        </section>

        {/* Recent Projects */}
        <section className="dash-section">
          <div className="dash-section-header">
            <h2 className="dash-section-title">Recent Projects</h2>
            <Link to="/showcase" className="dash-view-all">View All →</Link>
          </div>
          <div className="project-grid">
            {recentProjects.map((p) => (
              <div className="project-card" key={p.title}>
                <span className="project-category">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <p className="project-team">👥 {p.team}</p>
                <Link to="/showcase" className="btn-view">View Details</Link>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
