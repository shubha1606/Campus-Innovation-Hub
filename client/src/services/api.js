import axios from 'axios'

const BASE = 'https://campus-innovation-hub.onrender.com/api'

const api = axios.create({ baseURL: BASE })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const loginUser = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)
export const getMe = () => api.get('/auth/me')
export const forgotPassword = (data) => api.post('/auth/forgot-password', data)
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data)

// Mentor Auth
export const loginMentor = (data) => api.post('/mentors/login', data)
export const registerMentor = (data) => api.post('/mentors/register', data)
export const getMentorProfile = () => api.get('/mentors/profile')

// Users
export const getUsers = () => api.get('/users')
export const getUserById = (id) => api.get(`/users/${id}`)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/users/${id}`)
export const matchUsersBySkill = (skill) => api.get(`/users/match/${skill}`)

// Projects
export const getProjects = () => api.get('/projects')
export const getProjectById = (id) => api.get(`/projects/${id}`)
export const createProject = (data) => api.post('/projects', data)
export const updateProject = (id, data) => api.put(`/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/projects/${id}`)

// Events
export const getEvents = () => api.get('/events')
export const getEventById = (id) => api.get(`/events/${id}`)
export const createEvent = (data) => api.post('/events', data)
export const updateEvent = (id, data) => api.put(`/events/${id}`, data)
export const deleteEvent = (id) => api.delete(`/events/${id}`)

// Mentors
export const getMentors = () => api.get('/mentors')
export const getMentorById = (id) => api.get(`/mentors/${id}`)
export const updateMentor = (id, data) => api.put(`/mentors/${id}`, data)
export const deleteMentor = (id) => api.delete(`/mentors/${id}`)

// Startups
export const getStartups = () => api.get('/startups')
export const getStartupById = (id) => api.get(`/startups/${id}`)
export const createStartup = (data) => api.post('/startups', data)
export const updateStartup = (id, data) => api.put(`/startups/${id}`, data)
export const deleteStartup = (id) => api.delete(`/startups/${id}`)

// Dashboard
export const getDashboardStats = () => api.get('/dashboard')

// Bookings
export const getBookings = (params) => api.get('/bookings', { params })
export const createBooking = (data) => api.post('/bookings', data)
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data)
export const deleteBooking = (id) => api.delete(`/bookings/${id}`)

// Team Requests
export const getTeamRequests = () => api.get('/team-requests')
export const createTeamRequest = (data) => api.post('/team-requests', data)
export const updateTeamRequest = (id, data) => api.put(`/team-requests/${id}`, data)

// Chat & Messaging
export const getChatUsers = () => api.get('/messages/users')
export const getMessages = (targetId, targetModel) => api.get(`/messages/${targetId}`, { params: { targetModel } })
export const createMessage = (data) => api.post('/messages', data)
export const uploadMessageAttachment = (formData) => api.post('/messages/upload', formData)

// Notifications
export const getNotifications = () => api.get('/notifications')
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`)
export const markAllNotificationsRead = () => api.put('/notifications/read-all')

// Ideas
export const getIdeas = () => api.get('/ideas')
export const getIdeaById = (id) => api.get(`/ideas/${id}`)
export const createIdea = (data) => api.post('/ideas', data)
export const updateIdea = (id, data) => api.put(`/ideas/${id}`, data)
export const deleteIdea = (id) => api.delete(`/ideas/${id}`)

// Hackathons
export const getHackathons = () => api.get('/hackathons')
export const getHackathonById = (id) => api.get(`/hackathons/${id}`)
export const createHackathon = (data) => api.post('/hackathons', data)
export const updateHackathon = (id, data) => api.put(`/hackathons/${id}`, data)
export const deleteHackathon = (id) => api.delete(`/hackathons/${id}`)
export const registerHackathon = (id) => api.post(`/hackathons/${id}/register`)

export default api
