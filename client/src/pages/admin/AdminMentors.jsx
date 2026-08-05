import { useEffect, useState } from 'react'
import { Trash2, UserCheck } from 'lucide-react'
import { getMentors, deleteMentor } from '../../services/api'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import { PageSpinner } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import Avatar from '../../components/Avatar'
import toast from 'react-hot-toast'

export default function AdminMentors() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 10

  const load = () => {
    setLoading(true)
    getMentors().then(({ data }) => setMentors(data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteMentor(deleteId)
      toast.success('Mentor deleted')
      setDeleteId(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = mentors.filter((m) =>
    m.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    m.company?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Manage Mentors</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{filtered.length} mentors registered</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search mentors…" className="max-w-sm" />

      {paginated.length === 0 ? (
        <div className="text-center py-16">
          <UserCheck size={48} className="mx-auto mb-3 text-purple-300" />
          <p style={{ color: 'var(--text)' }}>No mentors found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Mentor', 'Company', 'Expertise', 'Experience', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((m) => (
                <tr key={m._id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={m.name} src={m.profileImage} size="sm" />
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text)' }}>{m.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{m.company || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {m.expertise?.slice(0, 2).map((e) => (
                        <span key={e} className="badge bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">{e}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{m.experience} yrs</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteId(m._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Mentor" message="Are you sure you want to delete this mentor?" />
    </div>
  )
}
