import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, ExternalLink, FolderOpen } from 'lucide-react'
import { getProjects, createProject, updateProject, deleteProject } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import { truncate, CATEGORY_OPTIONS } from '../../utils/helpers'
import toast from 'react-hot-toast'

const EMPTY = { title: '', description: '', technologies: '', category: '', githubUrl: '', liveDemoUrl: '' }

export default function StudentProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
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
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 8

  const load = () => {
    setLoading(true)
    getProjects().then(({ data }) => setProjects(data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditItem(null); setForm(EMPTY); setModal(true) }
  const openEdit = (p) => {
    setEditItem(p)
    setForm({ ...p, technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies })
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) { toast.error('Title and description required'); return }
    setSaving(true)
    try {
      const payload = { ...form, technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean) }
      if (editItem) { await updateProject(editItem._id, payload); toast.success('Project updated') }
      else { await createProject(payload); toast.success('Project created') }
      setModal(false); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await deleteProject(deleteId); toast.success('Project deleted'); setDeleteId(null); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
    finally { setDeleting(false) }
  }

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchFilter = filter === 'all' || p.category === filter || (filter === 'mine' && p.createdBy?._id === user?._id)
    return matchSearch && matchFilter
  })
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-5 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="page-header flex-1">
          <h1 className="text-xl font-bold gold-gradient-text">Projects</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{filtered.length} projects found</p>
        </div>
        <button className="btn-primary shrink-0" onClick={openCreate}><Plus size={16} /> New Project</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects…" className="flex-1" />
        <select className="input sm:w-40" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}>
          <option value="all">All Projects</option>
          <option value="mine">My Projects</option>
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>No projects found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Create your first project to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginated.map((p) => {
            const isOwner = p.createdBy?._id === user?._id
            return (
              <div key={p._id} className="card p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.12)' }}>
                    <FolderOpen size={17} style={{ color: 'var(--gold)' }} />
                  </div>
                  {isOwner && (
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(p._id)} className="p-1.5 rounded-lg transition-colors"
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444' }}
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{p.title}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{truncate(p.description, 80)}</p>
                </div>
                {p.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="badge badge-gold text-xs">{t}</span>
                    ))}
                    {p.technologies.length > 3 && <span className="badge text-xs" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>+{p.technologies.length - 3}</span>}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-auto pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs transition-colors" style={{ color: 'var(--muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                    >
                      <ExternalLink size={13} /> GitHub
                    </a>
                  )}
                  {p.liveDemoUrl && (
                    <a href={p.liveDemoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs transition-colors" style={{ color: 'var(--muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                    >
                      <ExternalLink size={13} /> Demo
                    </a>
                  )}
                  <span className="ml-auto text-xs" style={{ color: 'var(--muted2)' }}>{p.createdBy?.name}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />

      <Modal open={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div><label className="label">Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" required /></div>
          <div><label className="label">Description *</label><textarea className="input min-h-[80px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your project…" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Technologies (comma-separated)</label><input className="input" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" /></div>
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">GitHub URL</label><input className="input" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/…" /></div>
            <div><label className="label">Live Demo URL</label><input className="input" value={form.liveDemoUrl} onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })} placeholder="https://…" /></div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Project" message="Are you sure you want to delete this project? This action cannot be undone." />
    </div>
  )
}
