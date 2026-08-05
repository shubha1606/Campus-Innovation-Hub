import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lightbulb, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) { toast.error('Enter your email'); return }
    setSent(true)
    toast.success('Reset instructions sent (feature requires backend email setup)')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500 mb-3">
            <Lightbulb size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-slate-400 text-sm mt-1">We'll send you reset instructions</p>
        </div>

        <div className="glass rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-4">
              <Mail size={40} className="text-indigo-400 mx-auto mb-3" />
              <p className="text-white font-semibold">Check your email</p>
              <p className="text-slate-400 text-sm mt-1">Reset instructions sent to {email}</p>
              <Link to="/login" className="btn-primary mt-4 inline-flex">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                Send Reset Link
              </button>
              <p className="text-center text-sm text-slate-400">
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
