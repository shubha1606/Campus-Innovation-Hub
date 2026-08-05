import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, BookOpen, Clock } from 'lucide-react'
import { getBookings, updateBooking } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../../components/Spinner'
import { formatDate } from '../../utils/helpers'
import Avatar from '../../components/Avatar'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

export default function MentorRequests() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewItem, setReviewItem] = useState(null)
  const [meetingDetails, setMeetingDetails] = useState('')
  const [mentorNote, setMentorNote] = useState('')
  const [reviewAction, setReviewAction] = useState('approve')

  const { user } = useAuth()

  const load = () => {
    setLoading(true)
    const mentorId = user?._id
    getBookings(mentorId ? { mentorId } : undefined).then(({ data }) => setBookings(data)).finally(() => setLoading(false))
  }
  useEffect(load, [user])

  const openReviewModal = (booking, action) => {
    setReviewItem(booking)
    setReviewAction(action)
    setMeetingDetails(action === 'approve' ? (booking.meetingMode === 'online' ? booking.meetingLink || '' : booking.location || '') : '')
    setMentorNote(booking.mentorNote || '')
    setReviewModalOpen(true)
  }

  const handleReviewSubmit = async () => {
    if (!reviewItem) return
    const payload = {
      status: reviewAction === 'approve' ? 'Approved' : 'Rejected',
      mentorNote: mentorNote.trim() || undefined,
    }

    if (reviewAction === 'approve') {
      if (!meetingDetails.trim()) {
        toast.error(reviewItem?.meetingMode === 'online' ? 'Enter the meeting link' : 'Enter the offline details')
        return
      }
      if (reviewItem.meetingMode === 'online') payload.meetingLink = meetingDetails.trim()
      else payload.location = meetingDetails.trim()
    }

    setUpdating(reviewItem._id)
    try {
      await updateBooking(reviewItem._id, payload)
      toast.success(`Request ${reviewAction === 'approve' ? 'approved' : 'rejected'}`)
      setReviewModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${reviewAction === 'approve' ? 'approve' : 'reject'}`)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <PageSpinner />

  const statusStyle = (s) => {
    const st = String(s || '').toLowerCase()
    if (st === 'approved') return { background: 'rgba(34,197,94,0.12)', color: '#22c55e' }
    if (st === 'rejected') return { background: 'rgba(239,68,68,0.12)', color: '#ef4444' }
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
                {b.status === 'Approved' && (b.meetingMode === 'online' ? (
                  <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Link: <a href={b.meetingLink} className="text-indigo-300 break-all" target="_blank" rel="noreferrer">{b.meetingLink}</a></p>
                ) : (
                  <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Offline details: {b.location}</p>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="badge text-xs" style={statusStyle(b.status)}>{b.status || 'pending'}</span>
                {(!b.status || String(b.status).toLowerCase() === 'pending') && (
                  <>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34,197,94,0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34,197,94,0.12)'}
                      onClick={() => openReviewModal(b, 'approve')}
                      disabled={updating === b._id}
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                      onClick={() => openReviewModal(b, 'reject')}
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

      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title={`${reviewAction === 'approve' ? 'Approve' : 'Reject'} Request — ${reviewItem?.student?.name}`}>
        {reviewItem && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {reviewAction === 'approve'
                ? `Provide the ${reviewItem.meetingMode === 'online' ? 'meeting link' : 'offline details'} and approve the request.`
                : 'Optional note for the student explaining the rejection.'
              }
            </p>
            {reviewAction === 'approve' && (
              <>
                <div>
                  <label className="label">Mode</label>
                  <input className="input" value={reviewItem.meetingMode} disabled />
                </div>
                <div>
                  <label className="label">{reviewItem.meetingMode === 'online' ? 'Meeting Link' : 'Offline Details'}</label>
                  <input
                    className="input"
                    value={meetingDetails}
                    onChange={(e) => setMeetingDetails(e.target.value)}
                    placeholder={reviewItem.meetingMode === 'online' ? 'https://meet.google.com/...' : 'Enter venue, room, or instructions'}
                  />
                </div>
              </>
            )}
            <div>
              <label className="label">Message to student (optional)</label>
              <textarea
                className="input resize-none"
                rows={3}
                value={mentorNote}
                onChange={(e) => setMentorNote(e.target.value)}
                placeholder="Add a note for the student"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setReviewModalOpen(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleReviewSubmit} disabled={updating === reviewItem._id}>
                {updating === reviewItem._id ? `${reviewAction === 'approve' ? 'Approving…' : 'Rejecting…'}` : `${reviewAction === 'approve' ? 'Approve Request' : 'Reject Request'}`}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
