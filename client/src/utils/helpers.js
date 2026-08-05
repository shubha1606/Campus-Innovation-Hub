export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const passwordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const map = [
    { label: 'Too short', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Strong', color: '#6366f1' },
  ]
  return { score, ...map[score] }
}

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const timeAgo = (d) => {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export const truncate = (str, n = 80) => str?.length > n ? str.slice(0, n) + '…' : str

export const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export const SKILL_OPTIONS = [
  'React', 'Node.js', 'Python', 'Java', 'Machine Learning', 'Data Science',
  'UI/UX Design', 'Flutter', 'Android', 'iOS', 'DevOps', 'Blockchain',
  'Cybersecurity', 'Cloud Computing', 'MongoDB', 'PostgreSQL', 'TypeScript',
  'Next.js', 'Django', 'Spring Boot',
]

export const CATEGORY_OPTIONS = ['Web', 'Mobile', 'AI/ML', 'IoT', 'Blockchain', 'Game', 'Other']
export const DOMAIN_OPTIONS = ['EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'CleanTech', 'E-Commerce', 'SaaS', 'Other']
export const DEPT_OPTIONS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'Data Science', 'Artificial Intelligence', 'Other',
]
export const YEAR_OPTIONS = [1, 2, 3, 4]
export const EVENT_CATEGORIES = ['Hackathon', 'Workshop', 'Seminar', 'Competition', 'Other']
export const STARTUP_STATUSES = ['Idea', 'Prototype', 'MVP', 'Incubation', 'Funded', 'Completed']
