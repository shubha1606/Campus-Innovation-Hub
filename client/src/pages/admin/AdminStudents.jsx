import { useEffect, useState } from 'react'
import { Trash2, Users } from 'lucide-react'
import { getUsers, updateUser } from '../../services/api'
import api from '../../services/api'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import ConfirmDialog from '../../components/ConfirmDialog'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import Avatar from '../../components/Avatar'
import toast from 'react-hot-toast'

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 10

  const load = () => { setLoading(true); getUsers().then(({ data }) => setStudents(data.filter((u) => u.role === 'student'))).finally(() => setLoading(false)) }
  useEffect(load, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/users/${deleteId}`)
      toast.success('Student deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete (endpoint may not exist)')
      setDeleteId(null)
    } finally {
      setDeleting(false) }
  }

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.college?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Manage Students</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{filtered.length} students registered</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search students…" className="max-w-sm" />

      {loading ? (
        <div className="space-y-2">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16"><Users size={48} className="mx-auto mb-3 text-indigo-300" /><p style={{ color: 'var(--text)' }}>No students found</p></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Student', 'Email', 'College', 'Department', 'Year', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} src={s.profileImage} size="sm" />
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{s.email}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{s.college || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{s.branch || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{s.year || '—'}</td>
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
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Student" message="Are you sure you want to delete this student account?" />
    </div>
  )
}
