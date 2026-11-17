import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Check, MessageCircle, Plus, Send, Users } from 'lucide-react'
import {
  createProjectApplication,
  createProjectComment,
  createProjectUpdate,
  deleteProjectComment,
  deleteProjectUpdate,
  getMyProjectApplication,
  getProjectApplications,
  getProjectById,
  getProjectComments,
  getProjectMentorMatches,
  getProjectUpdates,
  reviewProjectApplication,
  updateProjectUpdate,
} from '../services/api'
import { useAuth } from '../context/AuthContext'
import { PageSpinner } from '../components/Spinner'
import { formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const EMPTY_UPDATE = { type: 'update', title: '', body: '', status: 'in_progress', dueDate: '' }

const sameId = (value, id) => (typeof value === 'string' ? value : value?._id)?.toString() === id?.toString()

const statusLabels = {
  planned: 'Planned',
  in_progress: 'In progress',
  completed: 'Completed',
}

export default function ProjectWorkspace() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const [project, setProject] = useState(null)
  const [application, setApplication] = useState(null)
  const [applications, setApplications] = useState([])
  const [updates, setUpdates] = useState([])
  const [comments, setComments] = useState([])
  const [mentorMatches, setMentorMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [updateForm, setUpdateForm] = useState(EMPTY_UPDATE)
  const [discussionBody, setDiscussionBody] = useState('')
  const [discussionKind, setDiscussionKind] = useState('question')
  const [replyDrafts, setReplyDrafts] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data: projectData } = await getProjectById(projectId)
      setProject(projectData)

      const isOwner = sameId(projectData.createdBy, user?._id)
      const requests = [getProjectUpdates(projectId), getProjectComments(projectId)]
      const indexes = {}

      if (role === 'student') {
        indexes.application = requests.push(getMyProjectApplication(projectId)) - 1
        indexes.mentors = requests.push(getProjectMentorMatches(projectId)) - 1
      }
      if (isOwner || role === 'admin') {
        indexes.applications = requests.push(getProjectApplications(projectId)) - 1
      }

      const results = await Promise.all(requests)
      setUpdates(results[0].data)
      setComments(results[1].data)
      setApplication(indexes.application === undefined ? null : results[indexes.application].data)
      setMentorMatches(indexes.mentors === undefined ? [] : results[indexes.mentors].data)
      setApplications(indexes.applications === undefined ? [] : results[indexes.applications].data)
    } catch (error) {
      setProject(null)
      toast.error(error.response?.data?.message || 'Failed to load project workspace')
    } finally {
      setLoading(false)
    }
  }, [projectId, role, user])

  useEffect(() => {
    load()
  }, [load])

  const isOwner = project && sameId(project.createdBy, user?._id)
  const isMember = project?.teamMembers?.some((member) => sameId(member, user?._id))
  const canManage = Boolean(isOwner || role === 'admin')
  const canContribute = Boolean(canManage || isMember)
  const projectBase = role === 'mentor' ? '/mentor/projects' : role === 'admin' ? '/admin/projects' : '/student/projects'

  const handleApplication = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const { data } = await createProjectApplication(projectId, { message: applicationMessage })
      setApplication(data.application)
      setApplicationMessage('')
      toast.success('Join request sent')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send join request')
    } finally {
      setSaving(false)
    }
  }

  const handleReviewApplication = async (applicationId, status) => {
    setSaving(true)
    try {
      await reviewProjectApplication(projectId, applicationId, { status })
      toast.success(`Application ${status.toLowerCase()}`)
      await load()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update application')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateUpdate = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await createProjectUpdate(projectId, {
        ...updateForm,
        dueDate: updateForm.dueDate || undefined,
      })
      setUpdateForm(EMPTY_UPDATE)
      toast.success(updateForm.type === 'milestone' ? 'Milestone added' : 'Project update posted')
      await load()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save project update')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateStatus = async (update, status) => {
    try {
      await updateProjectUpdate(projectId, update._id, { status })
      setUpdates((items) => items.map((item) => item._id === update._id ? { ...item, status } : item))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update milestone')
    }
  }

  const handleDeleteUpdate = async (update) => {
    if (!window.confirm(`Delete "${update.title}"?`)) return
    try {
      await deleteProjectUpdate(projectId, update._id)
      setUpdates((items) => items.filter((item) => item._id !== update._id))
      toast.success('Project update deleted')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete project update')
    }
  }

  const handlePostComment = async (event, parentComment) => {
    event.preventDefault()
    const body = parentComment ? replyDrafts[parentComment._id] : discussionBody
    if (!body?.trim()) return
    setSaving(true)
    try {
      const { data } = await createProjectComment(projectId, {
        body,
        kind: parentComment ? 'comment' : discussionKind,
        parentComment: parentComment?._id,
      })
      setComments((items) => [...items, data.comment])
      if (parentComment) {
        setReplyDrafts((drafts) => ({ ...drafts, [parentComment._id]: '' }))
      } else {
        setDiscussionBody('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not post to the discussion')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteComment = async (comment) => {
    if (!window.confirm('Delete this discussion post and its replies?')) return
    try {
      await deleteProjectComment(projectId, comment._id)
      setComments((items) => items.filter((item) => item._id !== comment._id && !sameId(item.parentComment, comment._id)))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete discussion post')
    }
  }

  if (loading) return <PageSpinner />
  if (!project) {
    return (
      <div className="card p-8 text-center">
        <p className="font-medium mb-3" style={{ color: 'var(--text)' }}>Project could not be found.</p>
        <button className="btn-secondary" onClick={() => navigate(-1)}>Go back</button>
      </div>
    )
  }

  const rootComments = comments.filter((comment) => !comment.parentComment)

  return (
    <div className="space-y-5 fade-in">
      <Link to={projectBase} className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--gold)' }}>
        <ArrowLeft size={15} /> Back to projects
      </Link>

      <section className="card p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="badge badge-gold text-xs">{project.projectType || 'Individual'}</span>
              {project.category && <span className="badge text-xs" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>{project.category}</span>}
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{project.title}</h1>
            <p className="text-sm mt-2 whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>{project.description}</p>
            <p className="text-xs mt-3" style={{ color: 'var(--muted2)' }}>Created by {project.createdBy?.name || 'Campus innovator'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.githubUrl && <a className="btn-secondary text-sm" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
            {project.liveDemoUrl && <a className="btn-secondary text-sm" href={project.liveDemoUrl} target="_blank" rel="noreferrer">Live demo</a>}
          </div>
        </div>
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.technologies.map((technology) => <span key={technology} className="badge badge-gold text-xs">{technology}</span>)}
          </div>
        )}
        {project.teamMembers?.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
            <Users size={14} style={{ color: 'var(--gold)' }} />
            {project.teamMembers.map((member) => member?.name).filter(Boolean).join(', ')}
          </div>
        )}
      </section>

      {project.projectType === 'Group' && role === 'student' && !isOwner && !isMember && (
        <section className="card p-5">
          <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Join this team</h2>
          {application?.status === 'Pending' ? (
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Your join request is awaiting the project owner’s review.</p>
          ) : application?.status === 'Approved' ? (
            <p className="text-sm mt-2 text-green-400">Your request was approved. You are a project member.</p>
          ) : (
            <form onSubmit={handleApplication} className="space-y-3 mt-3">
              {application?.status === 'Declined' && (
                <p className="text-sm text-amber-400">Your previous request was declined. You can send a new request.</p>
              )}
              <label className="label" htmlFor="applicationMessage">Tell the owner how you’d like to contribute (optional)</label>
              <textarea
                id="applicationMessage"
                className="input min-h-[80px] resize-y"
                maxLength={1000}
                value={applicationMessage}
                onChange={(event) => setApplicationMessage(event.target.value)}
                placeholder="Share relevant skills, interests, or experience"
              />
              <button type="submit" className="btn-primary" disabled={saving}>
                <Send size={14} /> {saving ? 'Sending…' : 'Request to join'}
              </button>
            </form>
          )}
        </section>
      )}

      {canManage && project.projectType === 'Group' && (
        <section className="card p-5">
          <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Team applications</h2>
          {applications.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.map((item) => (
                <div key={item._id} className="rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3" style={{ background: 'var(--surface2)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.applicant?.name || 'Student'}</p>
                    <p className="text-xs mt-1 whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>{item.message || 'No note included.'}</p>
                    {item.applicant?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.applicant.skills.slice(0, 5).map((skill) => <span key={skill} className="badge badge-gold text-xs">{skill}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge text-xs" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>{item.status}</span>
                    {item.status === 'Pending' && (
                      <>
                        <button className="btn-primary text-xs" disabled={saving} onClick={() => handleReviewApplication(item._id, 'Approved')}>
                          <Check size={13} /> Approve
                        </button>
                        <button className="btn-secondary text-xs" disabled={saving} onClick={() => handleReviewApplication(item._id, 'Declined')}>Decline</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="grid xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)] gap-5">
        <section className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={17} style={{ color: 'var(--gold)' }} />
            <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Updates and milestones</h2>
          </div>

          {canContribute && (
            <form onSubmit={handleCreateUpdate} className="space-y-3 mb-5 p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="updateType">Post type</label>
                  <select
                    id="updateType"
                    className="input"
                    value={updateForm.type}
                    onChange={(event) => setUpdateForm({
                      ...updateForm,
                      type: event.target.value,
                      status: event.target.value === 'milestone' ? 'planned' : 'in_progress',
                    })}
                  >
                    <option value="update">Progress update</option>
                    <option value="milestone">Milestone / task</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="updateDueDate">Deadline (optional)</label>
                  <input id="updateDueDate" type="date" className="input" value={updateForm.dueDate} onChange={(event) => setUpdateForm({ ...updateForm, dueDate: event.target.value })} />
                </div>
              </div>
              <input className="input" value={updateForm.title} onChange={(event) => setUpdateForm({ ...updateForm, title: event.target.value })} placeholder={updateForm.type === 'milestone' ? 'Milestone title' : 'Update title'} maxLength={120} required />
              <textarea className="input min-h-[80px] resize-y" value={updateForm.body} onChange={(event) => setUpdateForm({ ...updateForm, body: event.target.value })} placeholder="Details" maxLength={5000} required />
              <div className="flex justify-end">
                <button type="submit" className="btn-primary" disabled={saving}><Plus size={14} /> Add {updateForm.type === 'milestone' ? 'milestone' : 'update'}</button>
              </div>
            </form>
          )}

          {updates.length === 0 ? (
            <p className="text-sm py-4" style={{ color: 'var(--muted)' }}>No updates or milestones have been posted.</p>
          ) : (
            <div className="space-y-3">
              {updates.map((update) => (
                <article key={update._id} className="p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge badge-gold text-xs">{update.type === 'milestone' ? 'Milestone' : 'Update'}</span>
                        <h3 className="font-medium text-sm" style={{ color: 'var(--text)' }}>{update.title}</h3>
                      </div>
                      <p className="text-xs mt-2 whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>{update.body}</p>
                      <p className="text-xs mt-2" style={{ color: 'var(--muted2)' }}>
                        {update.author?.name || 'Project member'} · {formatDate(update.createdAt)}
                        {update.dueDate ? ` · Due ${formatDate(update.dueDate)}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge text-xs" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>{statusLabels[update.status]}</span>
                      {canContribute && update.type === 'milestone' && (
                        <select
                          className="input py-1 text-xs w-auto"
                          aria-label={`Update status for ${update.title}`}
                          value={update.status}
                          onChange={(event) => handleUpdateStatus(update, event.target.value)}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      )}
                      {canContribute && (
                        <button className="text-xs text-red-400" onClick={() => handleDeleteUpdate(update)} aria-label={`Delete ${update.title}`}>Delete</button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-5">
          {role === 'student' && (
            <section className="card p-5">
              <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Mentor recommendations</h2>
              {mentorMatches.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--muted)' }}>No close matches yet. Add skills and interests to your profile to improve recommendations.</p>
              ) : (
                <div className="space-y-3">
                  {mentorMatches.map(({ mentor, matchingProjectSkills, matchingStudentGoals }) => (
                    <div key={mentor._id} className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
                      <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{mentor.name}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{mentor.company || 'Mentor'}{mentor.experience ? ` · ${mentor.experience} yrs experience` : ''}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {[...new Set([...matchingProjectSkills, ...matchingStudentGoals])].map((skill) => <span key={skill} className="badge badge-gold text-xs">{skill}</span>)}
                      </div>
                    </div>
                  ))}
                  <Link to="/student/mentors" className="btn-secondary text-sm inline-flex">Browse all mentors</Link>
                </div>
              )}
            </section>
          )}

          <section className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={17} style={{ color: 'var(--gold)' }} />
              <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Project discussion</h2>
            </div>

            {['student', 'mentor'].includes(role) && (
              <form onSubmit={handlePostComment} className="space-y-2 mb-4">
                <select className="input" value={discussionKind} onChange={(event) => setDiscussionKind(event.target.value)} aria-label="Post type">
                  <option value="question">Ask a question</option>
                  <option value="comment">Add a comment</option>
                </select>
                <textarea className="input min-h-[72px] resize-y" value={discussionBody} onChange={(event) => setDiscussionBody(event.target.value)} placeholder="Share a question or comment…" maxLength={3000} required />
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary text-sm" disabled={saving}><Send size={13} /> Post</button>
                </div>
              </form>
            )}

            {rootComments.length === 0 ? (
              <p className="text-sm py-2" style={{ color: 'var(--muted)' }}>No discussion yet.</p>
            ) : (
              <div className="space-y-3">
                {rootComments.map((comment) => {
                  const replies = comments.filter((item) => sameId(item.parentComment, comment._id))
                  const canDelete = role === 'admin' || isOwner || sameId(comment.author, user?._id)
                  return (
                    <article key={comment._id} className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs" style={{ color: 'var(--text)' }}>{comment.author?.name || 'Community member'}</span>
                            <span className="badge text-xs" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>{comment.kind === 'question' ? 'Question' : 'Comment'}</span>
                          </div>
                          <p className="text-xs mt-2 whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>{comment.body}</p>
                        </div>
                        {canDelete && <button className="text-xs text-red-400 shrink-0" onClick={() => handleDeleteComment(comment)}>Delete</button>}
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--muted2)' }}>{formatDate(comment.createdAt)}</p>

                      {replies.map((reply) => (
                        <div key={reply._id} className="ml-3 mt-3 pl-3 border-l border-yellow-700/40">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{reply.author?.name || 'Community member'}</p>
                              <p className="text-xs mt-1 whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>{reply.body}</p>
                            </div>
                            {(role === 'admin' || isOwner || sameId(reply.author, user?._id)) && (
                              <button className="text-xs text-red-400 shrink-0" onClick={() => handleDeleteComment(reply)}>Delete</button>
                            )}
                          </div>
                        </div>
                      ))}

                      {['student', 'mentor'].includes(role) && (
                        <form onSubmit={(event) => handlePostComment(event, comment)} className="flex gap-2 mt-3">
                          <input
                            className="input text-xs"
                            value={replyDrafts[comment._id] || ''}
                            onChange={(event) => setReplyDrafts({ ...replyDrafts, [comment._id]: event.target.value })}
                            placeholder="Write a reply"
                            maxLength={3000}
                            aria-label={`Reply to ${comment.author?.name || 'discussion post'}`}
                            required
                          />
                          <button type="submit" className="btn-secondary text-xs shrink-0" disabled={saving}>Reply</button>
                        </form>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
