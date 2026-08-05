import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import {
  getNotifications,
  markNotificationRead as apiMarkNotificationRead,
  markAllNotificationsRead as apiMarkAllNotificationsRead,
} from '../services/api'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user, role } = useAuth()
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!user) return

   const client = io('https://campus-innovation-hub.onrender.com', {
  transports: ['websocket'],
  auth: { token: localStorage.getItem('token') },
})

    const userModel = role === 'mentor' ? 'Mentor' : 'User'

    client.on('connect', () => {
      setConnected(true)
      client.emit('register', { userId: user._id, userModel })
    })

    client.on('disconnect', () => {
      setConnected(false)
    })

    client.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev])
    })

    setSocket(client)

    return () => {
      client.disconnect()
      setSocket(null)
      setConnected(false)
    }
  }, [user, role])

  useEffect(() => {
    if (!user) {
      setNotifications([])
      return
    }

    getNotifications()
      .then(({ data }) => setNotifications(data))
      .catch(() => {})
  }, [user])

  const markRead = async (id) => {
    const { data } = await apiMarkNotificationRead(id)
    setNotifications((prev) => prev.map((item) => (item._id === id ? data : item)))
    return data
  }

  const markAll = async () => {
    const { data } = await apiMarkAllNotificationsRead()
    setNotifications(data)
    return data
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, markRead, markAll, connected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
