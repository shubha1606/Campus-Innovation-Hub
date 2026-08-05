import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Rocket, Bookmark, BookmarkCheck } from 'lucide-react'
import { getStartups, createStartup, updateStartup, deleteStartup } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import { truncate, STARTUP_STATUSES, DOMAIN_OPTIONS } from '../../utils/helpers'
import toast from 'react-hot-toast'

const statusStyle = {
  Idea: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' },
  Prototype: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  MVP: { bg: 'rgba(212,175,55,0.12)', color: '#D4AF37' },
  Incubation: { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
  Funded: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  Completed: { bg: 'rgba(249,115,22,0.12)', color: '#f97316' },
}

const EMPTY = { title: '', description: '', problemStatement: '', solution: '', domain: '', teamMembers: '', status: 'Idea' }

export default function StudentStartups() {
  const { user } = useAuth()
  const [startups, setStartups] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarkedStartups') || '[]'))
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 9

  const load = () => {
    setLoading(true)
    getStartups().then(({ data }) => setStartups(data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id) ? bookmarks.filter((x) => x !== id) : [...bookmarks, id]
    setBookmarks(updated)
    localStorage.setItem('bookmarkedStartups', JSON.stringify(updated))
    toast.success(bookmarks.includes(id) ? 'Bookmark removed' : 'Bookmarked!')
  }

  const openCreate = () => { setEditItem(null); setForm(EMPTY); setModal(true) }
  const openEdit = (s) => {
    setEditItem(s)
    setForm({ ...s, teamMembers: Array.isArray(s.teamMembers) ? s.teamMembers.join(', ') : s.teamMembers })
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.problemStatement || !form.solution || !form.domain) {
      toast.error('Please fill all required fields'); return
    }
    setSaving(true)
    try {
      const payload = { ...form, teamMembers: form.teamMembers.split(',').map((t) => t.trim()).filter(Boolean) }
      if (editItem) { await updateStartup(editItem._id, payload); toast.success('Startup updated') }
      else { await createStartup(payload); toast.success('Startup created') }
      setModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await deleteStartup(deleteId); toast.success('Startup deleted'); setDeleteId(null); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
    finally { setDeleting(false) }
  }

  const filtered = startups.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || s.domain?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchFilter = filter === 'all' || s.status === filter || (filter === 'mine' && s.createdBy?._id === user?._id) || (filter === 'bookmarked' && bookmarks.includes(s._id))
    return matchSearch && matchFilter
  })
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="page-header flex-1">
          <h1 className="text-xl font-bold gold-gradient-text">Startups</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{filtered.length} startups found</p>
        </div>
        <button className="btn-primary shrink-0" onClick={openCreate}><Plus size={16} /> New Startup</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search startups…" className="flex-1" />
        <select className="input sm:w-44" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}>
          <option value="all">All Startups</option>
          <option value="mine">My Startups</option>
          <option value="bookmarked">Bookmarked</option>
          {STARTUP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <Rocket size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>No startups found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((s) => {
            const isOwner = s.createdBy?._id === user?._id
            const isBookmarked = bookmarks.includes(s._id)
            const st = statusStyle[s.status] || statusStyle.Idea
            return (
              <div key={s._id} className="card p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="badge text-xs" style={{ background: st.bg, color: st.color }}>{s.status}</span>
                  <div className="flex gap-1">
                    <button onClick={() => toggleBookmark(s._id)} className="p-1.5 rounded-lg transition-colors" style={{ color: isBookmarked ? 'var(--gold)' : 'var(--muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-dim)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                    </button>
                    {isOwner && <>
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
                      ><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(s._id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#ef4444' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      ><Trash2 size={14} /></button>
                    </>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{s.title}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{truncate(s.description, 80)}</p>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                  <Rocket size={12} style={{ color: 'var(--gold)' }} /> {s.domain}
                  <span className="ml-auto" style={{ color: 'var(--muted2)' }}>{s.createdBy?.name}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />

      <Modal open={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Startup' : 'New Startup'} maxWidth="max-w-xl">
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Startup name" required /></div>
            <div><label className="label">Domain *</label>
              <select className="input" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>
                <option value="">Select domain</option>
                {DOMAIN_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">Description *</label><textarea className="input min-h-[70px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description…" required /></div>
          <div><label className="label">Problem Statement *</label><textarea className="input min-h-[60px] resize-none" value={form.problemStatement} onChange={(e) => setForm({ ...form, problemStatement: e.target.value })} placeholder="What problem does it solve?" required /></div>
          <div><label className="label">Solution *</label><textarea className="input min-h-[60px] resize-none" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} placeholder="How does it solve it?" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Team Members (comma-separated)</label><input className="input" value={form.teamMembers} onChange={(e) => setForm({ ...form, teamMembers: e.target.value })} placeholder="Alice, Bob, Charlie" /></div>
            <div><label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STARTUP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Startup" message="Are you sure you want to delete this startup?" />
    </div>
  )
}
