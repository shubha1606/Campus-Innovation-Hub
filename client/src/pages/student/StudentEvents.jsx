import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users, Tag } from 'lucide-react'
import { getEvents } from '../../services/api'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import { formatDate, truncate, EVENT_CATEGORIES } from '../../utils/helpers'
import toast from 'react-hot-toast'

const categoryAccent = {
  Hackathon: { bg: 'rgba(212,175,55,0.12)', color: '#D4AF37' },
  Workshop: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  Seminar: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  Competition: { bg: 'rgba(249,115,22,0.12)', color: '#f97316' },
  Other: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' },
}

export default function StudentEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [joined, setJoined] = useState(() => JSON.parse(localStorage.getItem('joinedEvents') || '[]'))
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 9

  useEffect(() => {
    getEvents().then(({ data }) => setEvents(data)).finally(() => setLoading(false))
  }, [])

  const handleJoin = (id) => {
    const updated = joined.includes(id) ? joined.filter((x) => x !== id) : [...joined, id]
    setJoined(updated)
    localStorage.setItem('joinedEvents', JSON.stringify(updated))
    toast.success(joined.includes(id) ? 'Left event' : 'Joined event!')
  }

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || e.organizer?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchFilter = filter === 'all' || e.category === filter || (filter === 'joined' && joined.includes(e._id))
    return matchSearch && matchFilter
  })
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">Events</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{filtered.length} events available</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="flex-1" />
        <select className="input sm:w-44" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}>
          <option value="all">All Events</option>
          <option value="joined">Joined</option>
          {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>No events found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((ev) => {
            const isJoined = joined.includes(ev._id)
            const accent = categoryAccent[ev.category] || categoryAccent.Other
            return (
              <div key={ev._id} className="card p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="badge text-xs" style={{ background: accent.bg, color: accent.color }}>{ev.category}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatDate(ev.date)}</span>
                </div>
               <div>
  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
    {ev.title}
  </h3>

  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
    {ev.description}
  </p>
</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                    <MapPin size={12} style={{ color: 'var(--gold)' }} /> {ev.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                    <Users size={12} style={{ color: 'var(--gold)' }} /> Organized by {ev.organizer}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                    <Tag size={12} style={{ color: 'var(--gold)' }} /> {ev.participants?.length || 0} participants
                  </div>
                </div>
                <button
                  onClick={() => handleJoin(ev._id)}
                  className="mt-auto w-full py-2 rounded-xl text-sm font-medium transition-all"
                  style={isJoined
                    ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }
                    : { background: 'linear-gradient(135deg,#D4AF37,#FFD700)', color: '#0B0B0B', fontWeight: 600 }
                  }
                >
                  {isJoined ? '✓ Joined — Click to Leave' : 'Join Event'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
    </div>
  )
}
