import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './AddProject.css'

const CATEGORIES = ['AI', 'IoT', 'Web Development', 'Mobile App', 'Robotics', 'Data Science', 'Cybersecurity', 'Other']
const STATUSES = ['Active', 'In Progress', 'Completed']

const EMPTY_FORM = {
  title: '',
  category: '',
  description: '',
  teamName: '',
  githubUrl: '',
  demoUrl: '',
  status: '',
}

function validate(form, members, techs) {
  const errors = {}
  if (!form.title.trim())       errors.title       = 'Project title is required.'
  if (!form.category)           errors.category    = 'Please select a category.'
  if (!form.description.trim()) errors.description = 'Project description is required.'
  if (!form.teamName.trim())    errors.teamName    = 'Team name is required.'
  if (members.length === 0)     errors.members     = 'Add at least one team member.'
  if (techs.length === 0)       errors.techs       = 'Add at least one technology.'
  if (!form.status)             errors.status      = 'Please select a project status.'
  if (form.githubUrl && !/^https?:\/\/.+/.test(form.githubUrl))
    errors.githubUrl = 'Enter a valid URL starting with http:// or https://'
  if (form.demoUrl && !/^https?:\/\/.+/.test(form.demoUrl))
    errors.demoUrl = 'Enter a valid URL starting with http:// or https://'
  return errors
}

export default function AddProject() {
  const navigate = useNavigate()
  const [form, setForm]         = useState(EMPTY_FORM)
  const [members, setMembers]   = useState([])
  const [techs, setTechs]       = useState([])
  const [memberInput, setMemberInput] = useState('')
  const [techInput, setTechInput]     = useState('')
  const [errors, setErrors]     = useState({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  // ── Tag helpers ──
  function addTag(value, list, setList, field, inputSetter) {
    const trimmed = value.trim()
    if (!trimmed || list.includes(trimmed)) return
    const next = [...list, trimmed]
    setList(next)
    inputSetter('')
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  function removeTag(value, list, setList) {
    setList(list.filter((t) => t !== value))
  }

  function handleTagKeyDown(e, value, list, setList, field, inputSetter) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(value, list, setList, field, inputSetter)
    }
  }

  // ── Submit ──
  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form, members, techs)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    // API call will be added later
    console.log('Project submitted:', { ...form, members, techs })
    setSubmitted(true)
  }

  function handleReset() {
    setForm(EMPTY_FORM)
    setMembers([])
    setTechs([])
    setMemberInput('')
    setTechInput('')
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="ap-success-page">
        <div className="ap-success-card">
          <span className="ap-success-icon">🎉</span>
          <h2>Project Submitted!</h2>
          <p>Your project has been successfully added to Campus Innovation Hub.</p>
          <div className="ap-success-actions">
            <Link to="/projects" className="ap-btn-primary">View Projects</Link>
            <button className="ap-btn-outline" onClick={handleReset}>Add Another</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ap-page">
      {/* Header */}
      <div className="ap-header">
        <div className="ap-header-inner">
          <h1>Add New Project</h1>
          <p>Share your project with the Campus Innovation Hub community.</p>
        </div>
      </div>

      <div className="ap-container">
        <form className="ap-form" onSubmit={handleSubmit} noValidate>

          {/* ── Row 1: Title + Category ── */}
          <div className="ap-row">
            <div className={`ap-field ${errors.title ? 'ap-field-error' : ''}`}>
              <label htmlFor="title">Project Title <span className="ap-required">*</span></label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. AI Campus Assistant"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <span className="ap-error-msg">{errors.title}</span>}
            </div>

            <div className={`ap-field ${errors.category ? 'ap-field-error' : ''}`}>
              <label htmlFor="category">Category <span className="ap-required">*</span></label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="ap-error-msg">{errors.category}</span>}
            </div>
          </div>

          {/* ── Description ── */}
          <div className={`ap-field ${errors.description ? 'ap-field-error' : ''}`}>
            <label htmlFor="description">Project Description <span className="ap-required">*</span></label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Describe your project — what it does, the problem it solves, and how it works..."
              value={form.description}
              onChange={handleChange}
            />
            {errors.description && <span className="ap-error-msg">{errors.description}</span>}
          </div>

          {/* ── Row 2: Team Name + Status ── */}
          <div className="ap-row">
            <div className={`ap-field ${errors.teamName ? 'ap-field-error' : ''}`}>
              <label htmlFor="teamName">Team Name <span className="ap-required">*</span></label>
              <input
                id="teamName"
                name="teamName"
                type="text"
                placeholder="e.g. Team Nexus"
                value={form.teamName}
                onChange={handleChange}
              />
              {errors.teamName && <span className="ap-error-msg">{errors.teamName}</span>}
            </div>

            <div className={`ap-field ${errors.status ? 'ap-field-error' : ''}`}>
              <label htmlFor="status">Project Status <span className="ap-required">*</span></label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="" disabled>Select status</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.status && <span className="ap-error-msg">{errors.status}</span>}
            </div>
          </div>

          {/* ── Team Members tag input ── */}
          <div className={`ap-field ${errors.members ? 'ap-field-error' : ''}`}>
            <label htmlFor="memberInput">
              Team Members <span className="ap-required">*</span>
              <span className="ap-hint"> — press Enter or comma to add</span>
            </label>
            <div className="ap-tag-input-wrapper">
              {members.map((m) => (
                <span className="ap-tag" key={m}>
                  {m}
                  <button type="button" onClick={() => removeTag(m, members, setMembers)} aria-label={`Remove ${m}`}>✕</button>
                </span>
              ))}
              <input
                id="memberInput"
                type="text"
                placeholder={members.length === 0 ? 'e.g. Arjun Sharma' : ''}
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, memberInput, members, setMembers, 'members', setMemberInput)}
                onBlur={() => addTag(memberInput, members, setMembers, 'members', setMemberInput)}
              />
            </div>
            {errors.members && <span className="ap-error-msg">{errors.members}</span>}
          </div>

          {/* ── Technologies tag input ── */}
          <div className={`ap-field ${errors.techs ? 'ap-field-error' : ''}`}>
            <label htmlFor="techInput">
              Technologies Used <span className="ap-required">*</span>
              <span className="ap-hint"> — press Enter or comma to add</span>
            </label>
            <div className="ap-tag-input-wrapper">
              {techs.map((t) => (
                <span className="ap-tag ap-tag-blue" key={t}>
                  {t}
                  <button type="button" onClick={() => removeTag(t, techs, setTechs)} aria-label={`Remove ${t}`}>✕</button>
                </span>
              ))}
              <input
                id="techInput"
                type="text"
                placeholder={techs.length === 0 ? 'e.g. React, Node.js' : ''}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, techInput, techs, setTechs, 'techs', setTechInput)}
                onBlur={() => addTag(techInput, techs, setTechs, 'techs', setTechInput)}
              />
            </div>
            {errors.techs && <span className="ap-error-msg">{errors.techs}</span>}
          </div>

          {/* ── Row 3: GitHub + Demo URLs ── */}
          <div className="ap-row">
            <div className={`ap-field ${errors.githubUrl ? 'ap-field-error' : ''}`}>
              <label htmlFor="githubUrl">GitHub Repository URL</label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/your-repo"
                value={form.githubUrl}
                onChange={handleChange}
              />
              {errors.githubUrl && <span className="ap-error-msg">{errors.githubUrl}</span>}
            </div>

            <div className={`ap-field ${errors.demoUrl ? 'ap-field-error' : ''}`}>
              <label htmlFor="demoUrl">Project Demo URL</label>
              <input
                id="demoUrl"
                name="demoUrl"
                type="url"
                placeholder="https://your-demo.com"
                value={form.demoUrl}
                onChange={handleChange}
              />
              {errors.demoUrl && <span className="ap-error-msg">{errors.demoUrl}</span>}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="ap-form-actions">
            <button type="submit" className="ap-btn-primary">🚀 Submit Project</button>
            <button type="button" className="ap-btn-outline" onClick={handleReset}>↺ Reset Form</button>
            <button type="button" className="ap-btn-ghost" onClick={() => navigate(-1)}>✕ Cancel</button>
          </div>

        </form>
      </div>
    </div>
  )
}
