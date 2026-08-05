import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { resetPassword } from '../services/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) return toast.error('Enter a new password')
    if (password !== confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await resetPassword(token, { password })
      toast.success('Password reset successful')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500 mb-3">
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">Set a new password for your account</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">New Password</label>
              <input type="password" className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password</label>
              <input type="password" className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Link to="/login" className="btn-secondary">Cancel</Link>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save Password'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
