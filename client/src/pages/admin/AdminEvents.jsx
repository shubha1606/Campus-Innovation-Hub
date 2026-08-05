import { useEffect, useState } from 'react'
import { Trash2, Calendar, Plus, Edit2 } from 'lucide-react'
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/api'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import Modal from '../../components/Modal'
import { PageSpinner } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import { formatDate, EVENT_CATEGORIES } from '../../utils/helpers'
import toast from 'react-hot-toast'

const EMPTY = { title: '', description: '', organizer: '', date: '', location: '', category: 'Other' }

export default function AdminEvents() {
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
  const PER_PAGE = 10

  const load = () => {
    setLoading(true)
    getEvents().then(({ data }) => setEvents(data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditItem(null); setForm(EMPTY); setModal(true) }
  const openEdit = (ev) => { setEditItem(ev); setForm({ ...ev, date: ev.date?.slice(0, 10) }); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.organizer || !form.date || !form.location) {
      toast.error('All fields are required'); return
    }
    setSaving(true)
    try {
      if (editItem) { await updateEvent(editItem._id, form); toast.success('Event updated') }
      else { await createEvent(form); toast.success('Event created') }
      setModal(false); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteEvent(deleteId); toast.success('Event deleted'); setDeleteId(null); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    e.organizer?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Manage Events</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{filtered.length} events total</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Create Event</button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search events…" className="max-w-sm" />

      {paginated.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={48} className="mx-auto mb-3 text-emerald-300" />
          <p style={{ color: 'var(--text)' }}>No events found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Title', 'Organizer', 'Date', 'Location', 'Category', 'Participants', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((ev) => (
                <tr key={ev._id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>{ev.title}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{ev.organizer}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{formatDate(ev.date)}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{ev.location}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{ev.category}</span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{ev.participants?.length || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <Edit2 size={13} style={{ color: 'var(--muted)' }} />
                      </button>
                      <button onClick={() => setDeleteId(ev._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />

      <Modal open={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Event' : 'Create Event'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div><label className="label">Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label className="label">Description *</label><textarea className="input min-h-[70px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Organizer *</label><input className="input" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} required /></div>
            <div>
              <label className="label">Category</label>
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
