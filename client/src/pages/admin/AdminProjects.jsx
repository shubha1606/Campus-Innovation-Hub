import { useEffect, useState } from 'react'
import { Trash2, FolderOpen, ExternalLink } from 'lucide-react'
import { getProjects, deleteProject } from '../../services/api'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import { PageSpinner } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import { truncate, CATEGORY_OPTIONS } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 10

  const load = () => {
    setLoading(true)
    getProjects().then(({ data }) => setProjects(data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteProject(deleteId)
      toast.success('Project deleted')
      setDeleteId(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.createdBy?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchFilter = filter === 'all' || p.category === filter
    return matchSearch && matchFilter
  })
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Manage Projects</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{filtered.length} projects total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects or creator…" className="flex-1" />
        <select className="input sm:w-44" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}>
          <option value="all">All Categories</option>
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen size={48} className="mx-auto mb-3 text-indigo-300" />
          <p style={{ color: 'var(--text)' }}>No projects found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Title', 'Creator', 'Category', 'Technologies', 'Links', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: 'var(--text)' }}>{p.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{truncate(p.description, 50)}</p>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{p.createdBy?.name || '—'}</td>
                  <td className="px-4 py-3">
                    {p.category && (
                      <span className="badge bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">{p.category}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.technologies?.slice(0, 2).map((t) => (
                        <span key={t} className="badge bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300">{t}</span>
                      ))}
                      {p.technologies?.length > 2 && (
                        <span className="badge bg-gray-100 text-gray-500">+{p.technologies.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {p.liveDemoUrl && (
                        <a href={p.liveDemoUrl} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteId(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Project" message="Are you sure you want to delete this project?" />
    </div>
  )
}
