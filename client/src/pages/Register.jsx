import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Briefcase, X, Plus } from 'lucide-react'
import { registerUser, registerMentor } from '../services/api'
import PasswordMeter from '../components/PasswordMeter'
import { validateEmail, SKILL_OPTIONS, DEPT_OPTIONS, YEAR_OPTIONS } from '../utils/helpers'
import toast from 'react-hot-toast'

function GoldInput({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type={type} className="input" placeholder={placeholder} value={value} onChange={onChange} required={required} />
    </div>
  )
}

function GoldSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input" value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('student')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  const [student, setStudent] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    college: '', branch: '', year: '', skills: [],
  })
  const [mentor, setMentor] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    company: '', designation: '', expertise: '', experience: '', linkedin: '',
  })

  const setS = (k, v) => setStudent((f) => ({ ...f, [k]: v }))
  const setM = (k, v) => setMentor((f) => ({ ...f, [k]: v }))

  const addSkill = (skill) => {
    if (skill && !student.skills.includes(skill)) setS('skills', [...student.skills, skill])
    setSkillInput('')
  }
  const removeSkill = (s) => setS('skills', student.skills.filter((x) => x !== s))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = tab === 'student' ? student : mentor
    if (!validateEmail(form.email)) { toast.error('Invalid email address'); return }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      if (tab === 'student') {
        await registerUser({
          name: student.name, email: student.email, password: student.password,
          role: 'student', college: student.college, branch: student.branch,
          year: Number(student.year), skills: student.skills,
        })
      } else {
        await registerMentor({
          name: mentor.name, email: mentor.email, password: mentor.password,
          company: mentor.company, expertise: [mentor.expertise],
          experience: Number(mentor.experience), bio: mentor.designation,
        })
      }
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-8"
      style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.08) 0%, #0B0B0B 50%, rgba(212,175,55,0.04) 100%)' }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(212,175,55,0.06)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(212,175,55,0.04)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212,175,55,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-lg relative fade-in">
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#FFD700)', boxShadow: '0 0 30px rgba(212,175,55,0.35)' }}
          >
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M20 4L36 12V20C36 28.837 28.837 36 20 36C11.163 36 4 28.837 4 20V12L20 4Z" fill="#0B0B0B" opacity="0.8"/>
              <circle cx="20" cy="20" r="5" fill="#D4AF37"/>
              <path d="M20 8V15M20 25V32M8 20H15M25 20H32" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold gold-gradient-text">Create Account</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted2)' }}>Join Campus Innovation Hub</p>
        </div>

        <div className="glass rounded-2xl p-6 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(212,175,55,0.08)' }}>
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
            {[{ key: 'student', label: 'Student', icon: GraduationCap }, { key: 'mentor', label: 'Mentor', icon: Briefcase }].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
                style={tab === key
                  ? { background: 'linear-gradient(135deg,#D4AF37,#FFD700)', color: '#0B0B0B', fontWeight: 700 }
                  : { color: 'var(--muted)' }
                }
              >
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'student' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <GoldInput label="Full Name" value={student.name} onChange={(e) => setS('name', e.target.value)} placeholder="John Doe" required />
                  <GoldInput label="Email" type="email" value={student.email} onChange={(e) => setS('email', e.target.value)} placeholder="you@college.edu" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <GoldInput label="College" value={student.college} onChange={(e) => setS('college', e.target.value)} placeholder="Your college" />
                  <GoldSelect label="Department" value={student.branch} onChange={(e) => setS('branch', e.target.value)} options={DEPT_OPTIONS} placeholder="Select dept." />
                </div>
                <GoldSelect label="Year" value={student.year} onChange={(e) => setS('year', e.target.value)} options={YEAR_OPTIONS} placeholder="Select year" />

                <div>
                  <label className="label">Skills</label>
                  <div className="flex gap-2 mb-2">
                    <select className="input flex-1" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}>
                      <option value="">Pick a skill</option>
                      {SKILL_OPTIONS.filter((s) => !student.skills.includes(s)).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary px-3 py-2">
                      <Plus size={16} />
                    </button>
                  </div>
                  {student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.map((s) => (
                        <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs badge-gold">
                          {s}
                          <button type="button" onClick={() => removeSkill(s)}><X size={11} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" value={student.password} onChange={(e) => setS('password', e.target.value)} />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }} onClick={() => setShowPw((s) => !s)}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <PasswordMeter password={student.password} />
                  </div>
                  <GoldInput label="Confirm Password" type="password" value={student.confirmPassword} onChange={(e) => setS('confirmPassword', e.target.value)} placeholder="••••••••" />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <GoldInput label="Full Name" value={mentor.name} onChange={(e) => setM('name', e.target.value)} placeholder="Jane Smith" required />
                  <GoldInput label="Email" type="email" value={mentor.email} onChange={(e) => setM('email', e.target.value)} placeholder="you@company.com" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <GoldInput label="Company" value={mentor.company} onChange={(e) => setM('company', e.target.value)} placeholder="Google, Microsoft…" />
                  <GoldInput label="Designation" value={mentor.designation} onChange={(e) => setM('designation', e.target.value)} placeholder="Senior Engineer" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <GoldInput label="Domain / Expertise" value={mentor.expertise} onChange={(e) => setM('expertise', e.target.value)} placeholder="AI/ML, Web Dev…" />
                  <GoldInput label="Experience (years)" type="number" value={mentor.experience} onChange={(e) => setM('experience', e.target.value)} placeholder="5" />
                </div>
                <GoldInput label="LinkedIn URL" value={mentor.linkedin} onChange={(e) => setM('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" value={mentor.password} onChange={(e) => setM('password', e.target.value)} />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }} onClick={() => setShowPw((s) => !s)}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <PasswordMeter password={mentor.password} />
                  </div>
                  <GoldInput label="Confirm Password" type="password" value={mentor.confirmPassword} onChange={(e) => setM('confirmPassword', e.target.value)} placeholder="••••••••" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-4" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: 'var(--gold)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
