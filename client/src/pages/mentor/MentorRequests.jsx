import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, BookOpen, Clock } from 'lucide-react'
import { getBookings, updateBooking } from '../../services/api'
import { PageSpinner } from '../../components/Spinner'
import { formatDate } from '../../utils/helpers'
import Avatar from '../../components/Avatar'
import toast from 'react-hot-toast'

export default function MentorRequests() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const load = () => {
    setLoading(true)
    getBookings().then(({ data }) => setBookings(data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleAction = async (id, status) => {
    setUpdating(id)
    try {
      await updateBooking(id, { status })
      toast.success(`Request ${status}`)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally { setUpdating(null) }
  }

  if (loading) return <PageSpinner />

  const statusStyle = (s) => {
    if (s === 'approved') return { background: 'rgba(34,197,94,0.12)', color: '#22c55e' }
    if (s === 'rejected') return { background: 'rgba(239,68,68,0.12)', color: '#ef4444' }
    return { background: 'rgba(234,179,8,0.12)', color: '#eab308' }
  }

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">Mentorship Requests</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{bookings.length} total requests</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>No requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar name={b.student?.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{b.student?.name || 'Unknown Student'}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{b.topic}</p>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--muted2)' }}>
                  <span className="flex items-center gap-1"><Clock size={11} style={{ color: 'var(--gold)' }} /> {formatDate(b.date)}{b.time ? ` at ${b.time}` : ''}</span>
                  <span>{b.meetingMode}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge text-xs" style={statusStyle(b.status)}>{b.status || 'pending'}</span>
                {(!b.status || b.status === 'pending') && (
                  <>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34,197,94,0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34,197,94,0.12)'}
                      onClick={() => handleAction(b._id, 'approved')}
                      disabled={updating === b._id}
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                      onClick={() => handleAction(b._id, 'rejected')}
                      disabled={updating === b._id}
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
