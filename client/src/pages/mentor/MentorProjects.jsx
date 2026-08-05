import { useEffect, useState } from 'react'
import { FolderOpen, ExternalLink } from 'lucide-react'
import { getProjects } from '../../services/api'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import { truncate, CATEGORY_OPTIONS } from '../../utils/helpers'

export default function MentorProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 9

  useEffect(() => {
    getProjects()
      .then(({ data }) => setProjects(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter((p) => {
    const matchSearch = p.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())

    const matchFilter = filter === 'all' || p.category === filter

    return matchSearch && matchFilter
  })

  const paginated = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  )

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">
          Student Projects
        </h1>

        <p
          className="text-sm mt-0.5"
          style={{ color: 'var(--muted)' }}
        >
          {filtered.length} projects
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search projects…"
          className="flex-1"
        />

        <select
          className="input sm:w-40"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="all">All Categories</option>

          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen
            size={48}
            className="mx-auto mb-3"
            style={{ color: 'var(--gold)' }}
          />

          <p
            className="font-medium"
            style={{ color: 'var(--text)' }}
          >
            No projects found
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((p) => (
            <div
              key={p._id}
              className="card p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                  }}
                >
                  <FolderOpen
                    size={17}
                    style={{ color: 'var(--gold)' }}
                  />
                </div>

                <div className="min-w-0">
                  <h3
                    className="font-semibold text-sm truncate"
                    style={{ color: 'var(--text)' }}
                  >
                    {p.title}
                  </h3>

                  <p
                    className="text-xs"
                    style={{ color: 'var(--muted2)' }}
                  >
                    by {p.createdBy?.name}
                  </p>
                </div>
              </div>

              <p
                className="text-xs"
                style={{ color: 'var(--muted)' }}
              >
                {truncate(p.description, 80)}
              </p>

              {p.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.technologies.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="badge badge-gold text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="flex items-center gap-3 mt-auto pt-2 text-xs"
                style={{
                  borderTop: '1px solid var(--border)',
                  color: 'var(--muted)',
                }}
              >
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        'var(--gold)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        'var(--muted)')
                    }
                  >
                    <ExternalLink size={12} />
                    GitHub
                  </a>
                )}

                {p.liveDemoUrl && (
                  <a
                    href={p.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        'var(--gold)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        'var(--muted)')
                    }
                  >
                    <ExternalLink size={12} />
                    Demo
                  </a>
                )}

                {p.category && (
                  <span className="ml-auto badge badge-gold text-xs">
                    {p.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        total={filtered.length}
        perPage={PER_PAGE}
        onChange={setPage}
      />
    </div>
  )
}