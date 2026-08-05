import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe, getMentorProfile } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightMode, setLightMode] = useState(() => localStorage.getItem('lightMode') === 'true')

  useEffect(() => {
    document.documentElement.classList.toggle('light', lightMode)
    localStorage.setItem('lightMode', lightMode)
  }, [lightMode])

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    const savedRole = localStorage.getItem('role')
    if (!token) { setLoading(false); return }
    try {
      if (savedRole === 'mentor') {
        const { data } = await getMentorProfile()
        setUser(data)
        setRole('mentor')
      } else {
        const { data } = await getMe()
        setUser(data)
        setRole(data.role)
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const login = (token, userData, userRole) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', userRole)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setRole(userRole)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    setUser(null)
    setRole(null)
  }

  const toggleTheme = () => setLightMode((d) => !d)

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, lightMode, toggleTheme, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
