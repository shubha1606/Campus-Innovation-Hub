import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/add-project', label: 'Add Project' },
  { to: '/find-teammates', label: 'Find Teammates' },
  { to: '/ideas', label: 'Project Ideas' },
  { to: '/hackathons', label: 'Hackathons' },
  { to: '/mentors', label: 'Mentors' },
  { to: '/showcase', label: 'Project Showcase' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          Campus Innovation Hub
        </NavLink>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="nav-auth">
            <NavLink to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</NavLink>
            <NavLink to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Register</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
