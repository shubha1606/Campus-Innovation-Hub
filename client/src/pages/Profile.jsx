import { useState } from 'react'
import './Profile.css'

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'Data Science', 'Artificial Intelligence', 'Other',
]

const initialProfile = {
  name: 'Arjun Sharma',
  email: 'arjun.sharma@college.edu',
  department: 'Computer Science',
  college: 'National Institute of Technology, Trichy',
  year: '3rd Year',
  bio: 'Passionate full-stack developer and ML enthusiast. I love building products that solve real campus problems. Currently exploring AI-powered applications and looking for teammates to collaborate on innovative projects.',
  skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'MongoDB'],
  github: 'https://github.com/arjunsharma',
  linkedin: 'https://linkedin.com/in/arjunsharma',
  projectsCount: 4,
  teamsCount: 2,
  hackathonsCount: 3,
}

function validate(form, skills) {
  const errors = {}
  if (!form.name.trim())       errors.name       = 'Name is required.'
  if (!form.email.trim())      errors.email      = 'Email is required.'
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.department)        errors.department = 'Please select a department.'
  if (!form.bio.trim())        errors.bio        = 'Bio is required.'
  if (skills.length === 0)     errors.skills     = 'Add at least one skill.'
  return errors
}

export default function Profile() {
  const [profile, setProfile]   = useState(initialProfile)
  const [editing, setEditing]   = useState(false)
  const [form, setForm]         = useState({})
  const [skills, setSkills]     = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors]     = useState({})
  const [saved, setSaved]       = useState(false)

  function startEdit() {
    setForm({
      name: profile.name,
      email: profile.email,
      department: profile.department,
      bio: profile.bio,
    })
    setSkills([...profile.skills])
    setErrors({})
    setSaved(false)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setErrors({})
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  // ── Skill tag helpers ──
  function addSkill(value) {
    const trimmed = value.trim()
    if (!trimmed || skills.includes(trimmed)) return
    setSkills([...skills, trimmed])
    setSkillInput('')
    if (errors.skills) setErrors({ ...errors, skills: '' })
  }

  function removeSkill(skill) {
    setSkills(skills.filter((s) => s !== skill))
  }

  function handleSkillKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  function handleSave(e) {
    e.preventDefault()
    const errs = validate(form, skills)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setProfile({ ...profile, ...form, skills })
    setEditing(false)
    setSaved(true)
  }

  return (
    <div className="profile-page">
      {/* Header banner */}
      <div className="profile-banner">
        <div className="profile-banner-inner">
          <div className="profile-avatar">
            {profile.name.charAt(0)}
          </div>
          <div className="profile-banner-info">
            <h1>{profile.name}</h1>
            <p>{profile.department} &nbsp;·&nbsp; {profile.year}</p>
            <p className="profile-college">🎓 {profile.college}</p>
          </div>
          {!editing && (
            <button className="prof-btn-primary" onClick={startEdit}>
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-container">
        {saved && !editing && (
          <div className="profile-toast">✅ Profile updated successfully!</div>
        )}

        {editing ? (
          /* ── Edit Form ── */
          <form className="profile-form" onSubmit={handleSave} noValidate>
            <h2 className="profile-form-title">Edit Profile</h2>

            <div className="prof-row">
              <div className={`prof-field ${errors.name ? 'prof-field-error' : ''}`}>
                <label htmlFor="name">Full Name <span className="prof-required">*</span></label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" />
                {errors.name && <span className="prof-error-msg">{errors.name}</span>}
              </div>

              <div className={`prof-field ${errors.email ? 'prof-field-error' : ''}`}>
                <label htmlFor="email">Email Address <span className="prof-required">*</span></label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" />
                {errors.email && <span className="prof-error-msg">{errors.email}</span>}
              </div>
            </div>

            <div className={`prof-field ${errors.department ? 'prof-field-error' : ''}`}>
              <label htmlFor="department">Department <span className="prof-required">*</span></label>
              <select id="department" name="department" value={form.department} onChange={handleChange}>
                <option value="" disabled>Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <span className="prof-error-msg">{errors.department}</span>}
            </div>

            <div className={`prof-field ${errors.skills ? 'prof-field-error' : ''}`}>
              <label htmlFor="skillInput">
                Skills <span className="prof-required">*</span>
                <span className="prof-hint"> — press Enter or comma to add</span>
              </label>
              <div className="prof-tag-wrapper">
                {skills.map((s) => (
                  <span className="prof-tag" key={s}>
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>✕</button>
                  </span>
                ))}
                <input
                  id="skillInput"
                  type="text"
                  placeholder={skills.length === 0 ? 'e.g. React, Python' : ''}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  onBlur={() => addSkill(skillInput)}
                />
              </div>
              {errors.skills && <span className="prof-error-msg">{errors.skills}</span>}
            </div>

            <div className={`prof-field ${errors.bio ? 'prof-field-error' : ''}`}>
              <label htmlFor="bio">Bio / About <span className="prof-required">*</span></label>
              <textarea id="bio" name="bio" rows={4} value={form.bio} onChange={handleChange} placeholder="Tell the community about yourself..." />
              {errors.bio && <span className="prof-error-msg">{errors.bio}</span>}
            </div>

            <div className="prof-form-actions">
              <button type="submit" className="prof-btn-primary">💾 Save Changes</button>
              <button type="button" className="prof-btn-outline" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>

        ) : (
          /* ── View Mode ── */
          <div className="profile-grid">
            {/* Left: main info */}
            <div className="profile-main">
              {/* About */}
              <section className="prof-card">
                <h2>About</h2>
                <p>{profile.bio}</p>
              </section>

              {/* Skills */}
              <section className="prof-card">
                <h2>Skills</h2>
                <div className="prof-skills">
                  {profile.skills.map((s) => (
                    <span className="prof-skill-tag" key={s}>{s}</span>
                  ))}
                </div>
              </section>

              {/* Stats */}
              <section className="prof-card">
                <h2>Activity</h2>
                <div className="prof-stats">
                  <div className="prof-stat">
                    <span className="prof-stat-value">{profile.projectsCount}</span>
                    <span className="prof-stat-label">Projects</span>
                  </div>
                  <div className="prof-stat">
                    <span className="prof-stat-value">{profile.teamsCount}</span>
                    <span className="prof-stat-label">Teams</span>
                  </div>
                  <div className="prof-stat">
                    <span className="prof-stat-value">{profile.hackathonsCount}</span>
                    <span className="prof-stat-label">Hackathons</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: details sidebar */}
            <div className="profile-sidebar">
              <section className="prof-card">
                <h2>Details</h2>
                <ul className="prof-details-list">
                  <li>
                    <span className="prof-detail-label">📧 Email</span>
                    <span className="prof-detail-value">{profile.email}</span>
                  </li>
                  <li>
                    <span className="prof-detail-label">🏛️ Department</span>
                    <span className="prof-detail-value">{profile.department}</span>
                  </li>
                  <li>
                    <span className="prof-detail-label">🎓 College</span>
                    <span className="prof-detail-value">{profile.college}</span>
                  </li>
                  <li>
                    <span className="prof-detail-label">📅 Year</span>
                    <span className="prof-detail-value">{profile.year}</span>
                  </li>
                </ul>
              </section>

              <section className="prof-card">
                <h2>Links</h2>
                <div className="prof-links">
                  <a href={profile.github} target="_blank" rel="noreferrer" className="prof-link-btn">
                    🐙 GitHub
                  </a>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="prof-link-btn prof-link-blue">
                    💼 LinkedIn
                  </a>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
