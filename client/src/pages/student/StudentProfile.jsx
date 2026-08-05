import { useEffect, useState } from 'react'
import { Camera, Save, X, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateUser } from '../../services/api'
import Avatar from '../../components/Avatar'
import { SKILL_OPTIONS, DEPT_OPTIONS, YEAR_OPTIONS } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function StudentProfile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', college: '', branch: '', year: '', bio: '', skills: [], profileImage: '' })
  const [saving, setSaving] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', college: user.college || '', branch: user.branch || '', year: user.year || '', bio: user.bio || '', skills: user.skills || [], profileImage: user.profileImage || '' })
  }, [user])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const addSkill = (s) => { if (s && !form.skills.includes(s)) set('skills', [...form.skills, s]); setSkillInput('') }
  const removeSkill = (s) => set('skills', form.skills.filter((x) => x !== s))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await updateUser(user._id, form)
      setUser(data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('profileImage', ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">My Profile</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Manage your personal information</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar name={form.name} src={form.profileImage} size="xl" />
            <label
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#FFD700)', boxShadow: '0 0 10px rgba(212,175,55,0.4)' }}
            >
              <Camera size={13} style={{ color: '#0B0B0B' }} />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>{user?.name}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{user?.email}</p>
            <span className="badge badge-gold mt-1">Student</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">College</label><input className="input" value={form.college} onChange={(e) => set('college', e.target.value)} placeholder="Your college" /></div>
            <div><label className="label">Department</label>
              <select className="input" value={form.branch} onChange={(e) => set('branch', e.target.value)}>
                <option value="">Select dept.</option>
                {DEPT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">Year</label>
            <select className="input" value={form.year} onChange={(e) => set('year', e.target.value)}>
              <option value="">Select year</option>
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div><label className="label">Bio</label><textarea className="input min-h-[80px] resize-none" value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Tell us about yourself…" /></div>

          <div>
            <label className="label">Skills</label>
            <div className="flex gap-2 mb-2">
              <select className="input flex-1" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}>
                <option value="">Pick a skill</option>
                {SKILL_OPTIONS.filter((s) => !form.skills.includes(s)).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary px-3"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map((s) => (
                <span key={s} className="flex items-center gap-1 badge badge-gold">
                  {s}<button type="button" onClick={() => removeSkill(s)}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={15} />{saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
