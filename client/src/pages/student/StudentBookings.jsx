import { useEffect, useState } from 'react'
import { Calendar, Edit2, Trash2 } from 'lucide-react'
import { getBookings, updateBooking, deleteBooking } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { SkeletonCard } from '../../components/Spinner'
import toast from 'react-hot-toast'

export default function StudentBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const load = () => {
    setLoading(true)
    const studentId = user?._id
    getBookings(studentId ? { studentId } : undefined).then(({ data }) => {
      setBookings(data)
    }).catch(() => setBookings([])).finally(() => setLoading(false))
  }

  useEffect(() => { if (user) load() }, [user])

  const openEdit = (b) => { setEditItem(b); setModalOpen(true) }

  // ensure meetingMode uses normalized lowercase values
  const openEditNormalized = (b) => {
    setEditItem({ ...b, meetingMode: b.meetingMode ? String(b.meetingMode).toLowerCase() : 'online' })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editItem) return
    setSaving(true)
    try {
      const payload = {
        date: editItem.date,
        time: editItem.time,
        topic: editItem.topic,
        meetingMode: editItem.meetingMode,
      }
      await updateBooking(editItem._id, payload)
      toast.success('Booking updated')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirmId) return
    setDeleting(true)
    try {
      await deleteBooking(confirmId)
      toast.success('Booking cancelled')
      setConfirmId(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    } finally { setDeleting(false) }
  }

  if (loading) return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_,i)=><SkeletonCard key={i} />)}</div>

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">My Bookings</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{bookings.length} bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>You have no bookings</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Browse mentors to request a session</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="card p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{b.mentor?.name}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{b.topic}</p>
                </div>
                <div className="text-xs text-right" style={{ color: 'var(--muted)' }}>
                  <div>{new Date(b.date).toLocaleDateString()}</div>
                  <div>{b.time}</div>
                </div>
              </div>
              {b.status === 'Approved' && b.meetingMode === 'online' && b.meetingLink && (
                <p className="text-xs" style={{ color: 'var(--muted)' }}><strong>Meeting link:</strong> <a href={b.meetingLink} className="text-indigo-300 break-all" target="_blank" rel="noreferrer">{b.meetingLink}</a></p>
              )}
              {b.status === 'Approved' && b.meetingMode === 'offline' && b.location && (
                <p className="text-xs" style={{ color: 'var(--muted)' }}><strong>Offline details:</strong> {b.location}</p>
              )}
              {b.mentorNote && (
                <p className="text-xs mt-1" style={{ color: b.status === 'Rejected' ? '#ef4444' : 'var(--muted)' }}><strong>Mentor note:</strong> {b.mentorNote}</p>
              )}
              {b.status === 'Pending' && (
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Request sent. Waiting for mentor response.</p>
              )}
              <div className="flex items-center gap-2 mt-auto">
                <button className="p-1.5 rounded-lg" onClick={() => openEditNormalized(b)} style={{ color: 'var(--muted)' }}><Edit2 size={14} /></button>
                <button className="p-1.5 rounded-lg" onClick={() => setConfirmId(b._id)} style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
                <div className="ml-auto text-xs" style={{ color: b.status === 'Approved' ? 'green' : b.status === 'Rejected' ? '#ef4444' : 'var(--muted)' }}>{b.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? `Edit Booking — ${editItem.mentor?.name}` : 'Edit Booking'}>
        {editItem && (
            <form onSubmit={handleSave} className="space-y-3">
            <div><label className="label">Topic</label><input className="input" value={editItem.topic} onChange={(e) => setEditItem({ ...editItem, topic: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Date</label><input type="date" className="input" value={editItem.date?.slice(0,10)} onChange={(e) => setEditItem({ ...editItem, date: e.target.value })} required /></div>
              <div><label className="label">Time</label><input type="time" className="input" value={editItem.time} onChange={(e) => setEditItem({ ...editItem, time: e.target.value })} /></div>
            </div>
            <div><label className="label">Meeting Mode</label>
              <select className="input" value={String(editItem.meetingMode || '').toLowerCase()} onChange={(e) => setEditItem({ ...editItem, meetingMode: e.target.value })}>
                <option value="online">Online</option><option value="offline">Offline</option>
              </select>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Meeting link or location details will be added by the mentor once the request is approved.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} loading={deleting} title="Cancel Booking" message="Are you sure you want to cancel this booking?" />
    </div>
  )
}
