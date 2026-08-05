import { useEffect, useState } from 'react'
import { Users, Send, Briefcase, Star } from 'lucide-react'
import { getMentors, createBooking } from '../../services/api'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import Avatar from '../../components/Avatar'
import toast from 'react-hot-toast'

export default function StudentMentors() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [saving, setSaving] = useState(false)
  const [booking, setBooking] = useState({ date: '', time: '', topic: '', meetingMode: 'online' })
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 9

  useEffect(() => {
    getMentors().then(({ data }) => setMentors(data)).finally(() => setLoading(false))
  }, [])

  const openRequest = (mentor) => { setSelectedMentor(mentor); setModal(true) }

  const handleRequest = async (e) => {
    e.preventDefault()
    if (!booking.date || !booking.topic) { toast.error('Date and topic are required'); return }
    setSaving(true)
    try {
      await createBooking({
        mentor: selectedMentor._id,
        date: booking.date,
        time: booking.time,
        topic: booking.topic,
        meetingMode: String(booking.meetingMode || 'online').toLowerCase(),
      })
      toast.success('Mentorship request sent!')
      setModal(false)
      setBooking({ date: '', time: '', topic: '', meetingMode: 'online' })
    } catch (err) {
      console.error('Booking request error', err)
      toast.error(err.response?.data?.message || err.message || 'Failed to send request')
    } finally { setSaving(false) }
  }

  const filtered = mentors.filter((m) =>
    m.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    m.expertise?.some((e) => e.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
    m.company?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">Mentors</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{filtered.length} mentors available</p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, expertise, company…" className="max-w-sm" />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <Users size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>No mentors found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((m) => (
            <div key={m._id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} src={m.profileImage} size="lg" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{m.name}</h3>
                  {m.company && <p className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}><Briefcase size={11} style={{ color: 'var(--gold)' }} /> {m.company}</p>}
                  <p className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}><Star size={11} style={{ color: '#FFD700' }} /> {m.experience} yrs exp.</p>
                </div>
              </div>
              {m.expertise?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {m.expertise.slice(0, 3).map((e) => (
                    <span key={e} className="badge badge-gold text-xs">{e}</span>
                  ))}
                </div>
              )}
              {m.bio && <p className="text-xs" style={{ color: 'var(--muted)' }}>{m.bio.slice(0, 80)}{m.bio.length > 80 ? '…' : ''}</p>}
              <button className="btn-primary justify-center mt-auto" onClick={() => openRequest(m)}>
                <Send size={14} /> Send Request
              </button>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />

      <Modal open={modal} onClose={() => setModal(false)} title={`Request Mentorship — ${selectedMentor?.name}`}>
        <form onSubmit={handleRequest} className="space-y-3">
          <div><label className="label">Topic *</label><input className="input" value={booking.topic} onChange={(e) => setBooking({ ...booking, topic: e.target.value })} placeholder="What do you want to discuss?" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Date *</label><input type="date" className="input" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} required /></div>
            <div><label className="label">Time</label><input type="time" className="input" value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} /></div>
          </div>
          <div><label className="label">Meeting Mode</label>
            <select className="input" value={booking.meetingMode} onChange={(e) => setBooking({ ...booking, meetingMode: e.target.value.toLowerCase() })}>
              <option value="online">Online</option><option value="offline">Offline</option>
            </select>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            The mentor will provide the meeting link or offline details when they approve your request.
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Sending…' : 'Send Request'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
