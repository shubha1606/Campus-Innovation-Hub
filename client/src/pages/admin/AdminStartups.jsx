import { useEffect, useState } from 'react'
import { Trash2, Rocket } from 'lucide-react'
import { getStartups, deleteStartup } from '../../services/api'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import { PageSpinner } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import { truncate, STARTUP_STATUSES } from '../../utils/helpers'
import toast from 'react-hot-toast'

const statusColors = {
  Idea: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
  Prototype: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  MVP: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  Incubation: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Funded: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Completed: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
}

export default function AdminStartups() {
  const [startups, setStartups] = useState([])
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
    getStartups().then(({ data }) => setStartups(data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteStartup(deleteId); toast.success('Startup deleted'); setDeleteId(null); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = startups.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.domain?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.createdBy?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  })
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Manage Startups</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{filtered.length} startups total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search startups…" className="flex-1" />
        <select className="input sm:w-44" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}>
          <option value="all">All Statuses</option>
          {STARTUP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-16">
          <Rocket size={48} className="mx-auto mb-3 text-orange-300" />
          <p style={{ color: 'var(--text)' }}>No startups found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Title', 'Founder', 'Domain', 'Description', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>{s.title}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{s.createdBy?.name || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{s.domain}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{truncate(s.description, 60)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusColors[s.status] || statusColors.Idea}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteId(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Startup" message="Are you sure you want to delete this startup?" />
    </div>
  )
}
