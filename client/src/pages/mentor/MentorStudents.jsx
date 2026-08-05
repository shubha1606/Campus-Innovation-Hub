import { useEffect, useState } from 'react'
import { Users, GraduationCap } from 'lucide-react'
import { getUsers } from '../../services/api'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import Avatar from '../../components/Avatar'

export default function MentorStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 12

  useEffect(() => {
    getUsers().then(({ data }) => setStudents(data.filter((u) => u.role === 'student'))).finally(() => setLoading(false))
  }, [])

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.college?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.branch?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">Students</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{filtered.length} students registered</p>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search students…" className="max-w-sm" />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <Users size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>No students found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginated.map((s) => (
            <div key={s._id} className="card p-4 flex flex-col items-center text-center gap-3">
              <Avatar name={s.name} src={s.profileImage} size="lg" />
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{s.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{s.branch}</p>
                <p className="text-xs" style={{ color: 'var(--muted2)' }}>{s.college}</p>
              </div>
              {s.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {s.skills.slice(0, 2).map((sk) => <span key={sk} className="badge badge-gold text-xs">{sk}</span>)}
                  {s.skills.length > 2 && <span className="badge text-xs" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>+{s.skills.length - 2}</span>}
                </div>
              )}
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
                <GraduationCap size={12} style={{ color: 'var(--gold)' }} /> Year {s.year || '—'}
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
    </div>
  )
}
