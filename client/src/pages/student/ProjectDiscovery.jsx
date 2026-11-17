import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, Users, Search } from 'lucide-react'
import { getGroupProjects } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../../components/Spinner'
import toast from 'react-hot-toast'

const applicationLabel = {
  Pending: 'Request pending',
  Approved: 'You are a member',
  Declined: 'Request declined',
}

export default function ProjectDiscovery() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGroupProjects()
      .then(({ data }) => setProjects(data))
      .catch((error) => toast.error(error.response?.data?.message || 'Failed to load group projects'))
      .finally(() => setLoading(false))
  }, [])

  const filteredProjects = projects.filter((project) => {
    const query = search.trim().toLowerCase()
    return !query || [project.title, project.description, project.category, ...(project.technologies || [])]
      .some((value) => value?.toLowerCase().includes(query))
  })

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">Discover Group Projects</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
          Find a team, explore its work, and request to contribute.
        </p>
      </div>

      <div className="relative max-w-lg">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted2)' }} />
        <input
          className="input pl-9"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects, categories, or technologies"
          aria-label="Search group projects"
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="card p-10 text-center">
          <FolderOpen size={42} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <p className="font-medium" style={{ color: 'var(--text)' }}>
            {projects.length ? 'No matching projects' : 'No group projects available yet'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const isOwner = project.createdBy?._id === user?._id
            const status = project.applicationStatus
            return (
              <article key={project._id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold" style={{ color: 'var(--text)' }}>{project.title}</h2>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      by {project.createdBy?.name || 'Campus innovator'}
                    </p>
                  </div>
                  <span className="badge badge-gold text-xs shrink-0">Group</span>
                </div>

                <p className="text-sm line-clamp-3" style={{ color: 'var(--muted)' }}>
                  {project.description}
                </p>

                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((technology) => (
                      <span key={technology} className="badge badge-gold text-xs">{technology}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs mt-auto" style={{ color: 'var(--muted)' }}>
                  <Users size={14} style={{ color: 'var(--gold)' }} />
                  {project.teamMembers?.length || 0} team member{project.teamMembers?.length === 1 ? '' : 's'}
                  {project.category && <span className="ml-auto">{project.category}</span>}
                </div>

                <div className="flex items-center justify-between gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  {status && !isOwner ? (
                    <span className="badge text-xs" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                      {applicationLabel[status] || status}
                    </span>
                  ) : <span />}
                  <Link
                    className="btn-primary text-sm"
                    to={`/student/projects/${project._id}`}
                  >
                    {isOwner ? 'Manage project' : status === 'Approved' ? 'Open workspace' : 'View and request'}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
