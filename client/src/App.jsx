import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import AccessDenied from './pages/AccessDenied'

import StudentHome from './pages/student/StudentHome'
import StudentProfile from './pages/student/StudentProfile'
import StudentProjects from './pages/student/StudentProjects'
import StudentEvents from './pages/student/StudentEvents'
import StudentStartups from './pages/student/StudentStartups'
import StudentMentors from './pages/student/StudentMentors'
import StudentMessages from './pages/student/StudentMessages'
import StudentSettings from './pages/student/StudentSettings'

import MentorHome from './pages/mentor/MentorHome'
import MentorProfile from './pages/mentor/MentorProfile'
import MentorStudents from './pages/mentor/MentorStudents'
import MentorProjects from './pages/mentor/MentorProjects'
import MentorRequests from './pages/mentor/MentorRequests'
import MentorEvents from './pages/mentor/MentorEvents'
import MentorMessages from './pages/mentor/MentorMessages'
import MentorSettings from './pages/mentor/MentorSettings'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminMentors from './pages/admin/AdminMentors'
import AdminProjects from './pages/admin/AdminProjects'
import AdminEvents from './pages/admin/AdminEvents'
import AdminStartups from './pages/admin/AdminStartups'
import AdminSettings from './pages/admin/AdminSettings'

function RootRedirect() {
  const { user, role, loading } = useAuth()
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3" style={{ background: 'var(--bg)' }}>
      <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: '#D4AF37' }} />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (role === 'admin') return <Navigate to="/admin" replace />
  if (role === 'mentor') return <Navigate to="/mentor" replace />
  return <Navigate to="/student" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      <Route element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/student" element={<StudentHome />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/projects" element={<StudentProjects />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/startups" element={<StudentStartups />} />
        <Route path="/student/mentors" element={<StudentMentors />} />
        <Route path="/student/messages" element={<StudentMessages />} />
        <Route path="/student/settings" element={<StudentSettings />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['mentor']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/mentor" element={<MentorHome />} />
        <Route path="/mentor/profile" element={<MentorProfile />} />
        <Route path="/mentor/students" element={<MentorStudents />} />
        <Route path="/mentor/projects" element={<MentorProjects />} />
        <Route path="/mentor/requests" element={<MentorRequests />} />
        <Route path="/mentor/events" element={<MentorEvents />} />
        <Route path="/mentor/messages" element={<MentorMessages />} />
        <Route path="/mentor/settings" element={<MentorSettings />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/mentors" element={<AdminMentors />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/startups" element={<AdminStartups />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#161616',
              color: '#FFFFFF',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#0B0B0B' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
