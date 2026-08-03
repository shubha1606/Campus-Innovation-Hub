import { Link, useLocation } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <div className="nf-page">
      <div className="nf-card">

        {/* Floating shapes decoration */}
        <div className="nf-shapes" aria-hidden="true">
          <span className="nf-shape nf-shape-1">💡</span>
          <span className="nf-shape nf-shape-2">🚀</span>
          <span className="nf-shape nf-shape-3">🏆</span>
          <span className="nf-shape nf-shape-4">🤝</span>
        </div>

        {/* 404 heading */}
        <div className="nf-code" aria-label="404">
          <span>4</span>
          <span className="nf-zero">
            <span className="nf-zero-inner">🔭</span>
          </span>
          <span>4</span>
        </div>

        <h1 className="nf-title">Page Not Found</h1>

        <p className="nf-desc">
          Oops! The page{' '}
          <code className="nf-path">{pathname}</code>{' '}
          doesn't exist or may have been moved. Let's get you back on track.
        </p>

        {/* Suggestions */}
        <div className="nf-suggestions">
          <p className="nf-suggestions-label">You might be looking for:</p>
          <div className="nf-suggestion-links">
            <Link to="/dashboard" className="nf-suggestion-link">🏠 Dashboard</Link>
            <Link to="/projects" className="nf-suggestion-link">📁 Projects</Link>
            <Link to="/hackathons" className="nf-suggestion-link">🏆 Hackathons</Link>
            <Link to="/mentors" className="nf-suggestion-link">🧑🏫 Mentors</Link>
          </div>
        </div>

        {/* Primary actions */}
        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">← Go Home</Link>
          <Link to="/projects" className="nf-btn-outline">Browse Projects</Link>
        </div>

      </div>
    </div>
  )
}
