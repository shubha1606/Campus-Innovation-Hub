import { useEffect, useState } from 'react'
import { Camera, Save, X, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateMentor } from '../../services/api'
import Avatar from '../../components/Avatar'
import toast from 'react-hot-toast'

export default function MentorProfile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', company: '', bio: '', experience: '', expertise: [], profileImage: '' })
  const [saving, setSaving] = useState(false)
  const [expInput, setExpInput] = useState('')

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', company: user.company || '', bio: user.bio || '', experience: user.experience || '', expertise: user.expertise || [], profileImage: user.profileImage || '' })
  }, [user])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const addExp = () => { if (expInput && !form.expertise.includes(expInput)) { set('expertise', [...form.expertise, expInput]); setExpInput('') } }
  const removeExp = (e) => set('expertise', form.expertise.filter((x) => x !== e))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await updateMentor(user._id, form)
      setUser(data.mentor || data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
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
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Manage your mentor profile</p>
      </div>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar name={form.name} src={form.profileImage} size="xl" />
            <label
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#FFD700)', boxShadow: '0 0 10px rgba(212,175,55,0.4)' }}
            >
              <Camera size={13} style={{ color: '#0B0B0B' }} />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>{user?.name}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{user?.email}</p>
            <span className="badge badge-gold mt-1">Mentor</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div><label className="label">Company</label><input className="input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Google, Microsoft…" /></div>
          </div>
          <div><label className="label">Experience (years)</label><input type="number" className="input" value={form.experience} onChange={(e) => set('experience', e.target.value)} /></div>
          <div><label className="label">Bio</label><textarea className="input min-h-[80px] resize-none" value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Tell students about yourself…" /></div>
          <div>
            <label className="label">Expertise</label>
            <div className="flex gap-2 mb-2">
              <input className="input flex-1" value={expInput} onChange={(e) => setExpInput(e.target.value)} placeholder="Add expertise area" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExp())} />
              <button type="button" onClick={addExp} className="btn-primary px-3"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.expertise.map((e) => (
                <span key={e} className="flex items-center gap-1 badge badge-gold">
                  {e}<button type="button" onClick={() => removeExp(e)}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary" disabled={saving}><Save size={15} />{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
