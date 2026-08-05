import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react'
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import { formatDate, truncate, EVENT_CATEGORIES } from '../../utils/helpers'
import toast from 'react-hot-toast'

const EMPTY = { title: '', description: '', organizer: '', date: '', location: '', category: 'Other' }

export default function MentorEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 9

  const load = () => { setLoading(true); getEvents().then(({ data }) => setEvents(data)).finally(() => setLoading(false)) }
  useEffect(load, [])

  const openCreate = () => { setEditItem(null); setForm(EMPTY); setModal(true) }
  const openEdit = (ev) => { setEditItem(ev); setForm({ ...ev, date: ev.date?.slice(0, 10) }); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.organizer || !form.date || !form.location) { toast.error('All fields required'); return }
    setSaving(true)
    try {
      if (editItem) { await updateEvent(editItem._id, form); toast.success('Event updated') }
      else { await createEvent(form); toast.success('Event created') }
      setModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await deleteEvent(deleteId); toast.success('Event deleted'); setDeleteId(null); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
    finally { setDeleting(false) }
  }

  const filtered = events.filter((e) => e.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const categoryAccent = { Hackathon: '#D4AF37', Workshop: '#22c55e', Seminar: '#60a5fa', Competition: '#f97316', Other: '#94a3b8' }

  return (
    <div className="space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="page-header flex-1">
          <h1 className="text-xl font-bold gold-gradient-text">Events</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{filtered.length} events</p>
        </div>
        <button className="btn-primary shrink-0" onClick={openCreate}><Plus size={16} /> Create Event</button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="max-w-sm" />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>No events found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((ev) => {
            const isOwner = ev.createdBy?._id === user?._id
            const accent = categoryAccent[ev.category] || '#94a3b8'
            return (
              <div key={ev._id} className="card p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="badge text-xs" style={{ background: `${accent}18`, color: accent }}>{ev.category}</span>
                  {isOwner && (
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
                      ><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(ev._id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#ef4444' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      ><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{ev.title}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{truncate(ev.description, 70)}</p>
                </div>
                <div className="space-y-1 text-xs" style={{ color: 'var(--muted)' }}>
                  <div className="flex items-center gap-1"><Calendar size={11} style={{ color: 'var(--gold)' }} /> {formatDate(ev.date)}</div>
                  <div className="flex items-center gap-1"><MapPin size={11} style={{ color: 'var(--gold)' }} /> {ev.location}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />

      <Modal open={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Event' : 'Create Event'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div><label className="label">Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label className="label">Description *</label><textarea className="input min-h-[70px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Organizer *</label><input className="input" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} required /></div>
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Date *</label><input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
            <div><label className="label">Location *</label><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Event" message="Are you sure you want to delete this event?" />
    </div>
  )
}
