import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import './Projects.css'

const CATEGORIES = ['All', 'AI', 'IoT', 'Web Development', 'Mobile App', 'Robotics']

export default function Projects() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  return (
    <div className="projects-page">
      {/* Page Header */}
      <div className="projects-header">
        <div className="projects-header-inner">
          <h1>Projects</h1>
          <p>Explore innovative projects built by students across the campus.</p>
        </div>
      </div>

      <div className="projects-container">
        {/* Search & Filters */}
        <div className="projects-toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search projects by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              aria-label="Search projects"
            />
            {search && (
              <button
                className="search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-btns" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'filter-btn-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="results-count">
          Showing <strong>{filtered.length}</strong> project{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' && <> in <strong>{activeCategory}</strong></>}
          {search && <> matching "<strong>{search}</strong>"</>}
        </p>

        {/* Project Cards */}
        {filtered.length > 0 ? (
          <div className="projects-grid">
            {filtered.map((p) => (
              <div className="proj-card" key={p.id}>
                {/* Image placeholder */}
                <div className="proj-img" style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}44)` }}>
                  <span className="proj-initials" style={{ color: p.color }}>{p.initials}</span>
                </div>

                <div className="proj-body">
                  <div className="proj-meta">
                    <span className="proj-category">{p.category}</span>
                    <span className={`proj-status ${p.status === 'Active' ? 'status-active' : 'status-done'}`}>
                      {p.status}
                    </span>
                  </div>

                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <p className="proj-team">👥 {p.team}</p>

                  <Link to={`/projects/${p.id}`} className="btn-view-proj">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span>🔎</span>
            <p>No projects found. Try a different search or category.</p>
            <button
              className="filter-btn filter-btn-active"
              onClick={() => { setSearch(''); setActiveCategory('All') }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
