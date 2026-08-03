import { useParams, Link, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import './ProjectDetails.css'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === Number(id))

  if (!project) {
    return (
      <div className="pd-not-found">
        <span>🔎</span>
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist.</p>
        <Link to="/projects" className="pd-btn-back">← Back to Projects</Link>
      </div>
    )
  }

  return (
    <div className="pd-page">
      {/* Banner */}
      <div
        className="pd-banner"
        style={{ background: `linear-gradient(135deg, ${project.color}18, ${project.color}35)` }}
      >
        <div className="pd-banner-inner">
          <div className="pd-banner-img" style={{ background: `linear-gradient(135deg, ${project.color}30, ${project.color}55)` }}>
            <span style={{ color: project.color }}>{project.initials}</span>
          </div>
          <div className="pd-banner-info">
            <div className="pd-banner-meta">
              <span className="pd-category">{project.category}</span>
              <span className={`pd-status ${project.status === 'Active' ? 'status-active' : 'status-done'}`}>
                {project.status === 'Active' ? '🟢' : '✅'} {project.status}
              </span>
            </div>
            <h1>{project.title}</h1>
            <p className="pd-team-name">👥 {project.team} &nbsp;·&nbsp; 📅 {project.created}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pd-container">
        {/* Action buttons */}
        <div className="pd-actions">
          <button className="pd-btn-outline" onClick={() => navigate(-1)}>← Back to Projects</button>
          <div className="pd-actions-right">
            <button className="pd-btn-outline">✏️ Edit Project</button>
            <button className="pd-btn-primary">＋ Join Project</button>
          </div>
        </div>

        <div className="pd-grid">
          {/* Left column */}
          <div className="pd-left">
            {/* About */}
            <section className="pd-card">
              <h2>About This Project</h2>
              <p>{project.fullDesc}</p>
            </section>

            {/* Team Members */}
            <section className="pd-card">
              <h2>Team Members</h2>
              <div className="pd-members">
                {project.members.map((m) => (
                  <div className="pd-member" key={m.name}>
                    <div
                      className="pd-member-avatar"
                      style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}99)` }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="pd-member-name">{m.name}</p>
                      <p className="pd-member-role">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="pd-right">
            {/* Project Info */}
            <section className="pd-card">
              <h2>Project Info</h2>
              <ul className="pd-info-list">
                <li>
                  <span className="pd-info-label">Category</span>
                  <span className="pd-info-value">{project.category}</span>
                </li>
                <li>
                  <span className="pd-info-label">Status</span>
                  <span className={`pd-status-inline ${project.status === 'Active' ? 'status-active' : 'status-done'}`}>
                    {project.status}
                  </span>
                </li>
                <li>
                  <span className="pd-info-label">Team</span>
                  <span className="pd-info-value">{project.team}</span>
                </li>
                <li>
                  <span className="pd-info-label">Members</span>
                  <span className="pd-info-value">{project.members.length}</span>
                </li>
                <li>
                  <span className="pd-info-label">Created</span>
                  <span className="pd-info-value">{project.created}</span>
                </li>
              </ul>
            </section>

            {/* Technologies */}
            <section className="pd-card">
              <h2>Technologies Used</h2>
              <div className="pd-tech-tags">
                {project.tech.map((t) => (
                  <span className="pd-tag" key={t}>{t}</span>
                ))}
              </div>
            </section>

            {/* Join CTA */}
            <section className="pd-card pd-cta-card">
              <h2>Interested in this project?</h2>
              <p>Join the team and contribute your skills to make this project a success.</p>
              <button className="pd-btn-primary pd-btn-full">＋ Join Project</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
