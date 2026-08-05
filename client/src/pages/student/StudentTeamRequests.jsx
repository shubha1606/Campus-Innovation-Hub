import { useEffect, useState } from 'react'
import { MessageSquare, Users, FileText } from 'lucide-react'
import { getUsers, getProjects, createTeamRequest, getTeamRequests } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import { SkeletonCard } from '../../components/Spinner'
import { useDebounce } from '../../hooks/useDebounce'
import Avatar from '../../components/Avatar'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

export default function StudentTeamRequests() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [projects, setProjects] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedProject, setSelectedProject] = useState('')
  const [message, setMessage] = useState('')
  const debouncedSearch = useDebounce(search)
  const PER_PAGE = 12

  useEffect(() => {
    let mounted = true
    setLoading(true)

    const loadData = async () => {
      try {
        const usersRes = await getUsers()
        if (mounted) setStudents(usersRes.data.filter((u) => u.role === 'student' && u._id !== user?._id))
      } catch (err) {
        toast.error('Unable to load students')
      }

      try {
        const projectsRes = await getProjects()
        if (mounted) {
          setProjects(projectsRes.data || [])
          setSelectedProject(projectsRes.data?.[0]?._id || '')
        }
      } catch (err) {
        toast.error('Unable to load projects')
      }

      try {
        const requestsRes = await getTeamRequests()
        if (mounted) setRequests(requestsRes.data || [])
      } catch (err) {
        toast.error('Unable to load team requests')
      }
    }

    loadData().finally(() => {
      if (mounted) setLoading(false)
    })

    return () => { mounted = false }
  }, [user])

  const studentsWithMatch = students.map((s) => ({
    ...s,
    matchCount: (s.skills || []).filter((skill) => user?.skills?.includes(skill)).length || 0,
  }))

  const filtered = studentsWithMatch
    .filter((s) =>
      s.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.college?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.branch?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.skills?.join(' ').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.interests?.join(' ').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      String(s.year || '').includes(debouncedSearch)
    )
    .sort((a, b) => b.matchCount - a.matchCount)

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const openRequestModal = (student) => {
    setSelectedStudent(student)
    setMessage('')
    setModalOpen(true)
  }

  const handleSendRequest = async (e) => {
    e.preventDefault()
    if (!selectedStudent) return
    if (!message.trim()) return toast.error('Add a message with your request')

    const payload = {
      receiver: selectedStudent._id,
      message: message.trim(),
    }
    if (selectedProject) payload.project = selectedProject

    try {
      await createTeamRequest(payload)
      toast.success('Team request sent')
      setModalOpen(false)
      setMessage('')
      getTeamRequests().then(({ data }) => setRequests(data || []))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    }
  }

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <h1 className="text-xl font-bold gold-gradient-text">Find Teammates</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{filtered.length} students available</p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Search by name, branch, college, skills, interests, or year.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, branch, college, skills or interests…" className="max-w-full" />

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
              <p className="font-medium" style={{ color: 'var(--text)' }}>No students found</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((student) => (
                <div key={student._id} className="card p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} src={student.profileImage} size="lg" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{student.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{student.branch} • {student.college}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {student.skills?.slice(0, 3).map((skill) => <span key={skill} className="badge badge-gold text-xs">{skill}</span>)}
                  </div>
                  {student.matchCount > 0 && (
                    <p className="text-xs mt-1" style={{ color: 'var(--gold)' }}>{student.matchCount} matching skill{student.matchCount > 1 ? 's' : ''}</p>
                  )}
                  <button className="btn-primary justify-center mt-auto" onClick={() => openRequestModal(student)}>
                    <MessageSquare size={14} /> Request Team
                  </button>
                </div>
              ))}
            </div>
          )}

          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>

        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <FileText size={18} style={{ color: 'var(--gold)' }} />
              <div>
                <p className="font-semibold">Your Team Requests</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Review the status of requests you’ve sent.</p>
              </div>
            </div>
            {requests.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--muted)' }}>You haven't sent any requests yet.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req._id} className="rounded-xl border p-3" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{req.receiver?.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Status: <span style={{ color: req.status === 'Accepted' ? 'green' : req.status === 'Rejected' ? '#ef4444' : 'var(--muted)' }}>{req.status}</span></p>
                    <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{req.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Users size={18} style={{ color: 'var(--gold)' }} />
              <div>
                <p className="font-semibold">Pro Tip</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Include your project idea and why you want this teammate. That helps students respond faster.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Request Team — ${selectedStudent?.name}`}>
        <form onSubmit={handleSendRequest} className="space-y-4">
          {projects.length > 0 && (
            <div>
              <label className="label">Project</label>
              <select
                className="input"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select a project (optional)</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.title}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label">Message *</label>
            <textarea
              className="input resize-none"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell them what project you’re building and why you want them on your team."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Send Request</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
