import { useState } from 'react'
import { Bell, CheckCircle2, CircleDashed } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'

export default function Notifications() {
  const navigate = useNavigate()
  const { notifications, unreadCount, markRead, markAll, connected } = useSocket()
  const [open, setOpen] = useState(false)

  const handleToggle = () => setOpen((value) => !value)

 const handleSelect = async (notification) => {
  console.log("Notification:", notification)
  console.log("Link:", notification.link)

  await markRead(notification._id)
  setOpen(false)

  if (notification.link) {
    console.log("Navigating to:", notification.link)
    navigate(notification.link)
  } else {
    console.log("No link found!")
  }
}

  return (
    <div className="relative">
      <button
        className="p-2 rounded-lg transition-colors relative"
        style={{ color: 'var(--muted)' }}
        onClick={handleToggle}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = open ? 'var(--gold-dim)' : 'transparent'; e.currentTarget.style.color = open ? 'var(--gold)' : 'var(--muted)' }}
      >
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: unreadCount ? '#D4AF37' : '#6b7280' }} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-2xl border bg-surface shadow-2xl z-50"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <div className="flex items-center justify-between gap-2 p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Notifications</p>
              <p className="text-xs" style={{ color: 'var(--muted2)' }}>{connected ? 'Live updates enabled' : 'Offline mode'}</p>
            </div>
            <button
              className="text-xs uppercase tracking-[0.12em]"
              style={{ color: 'var(--gold)' }}
              onClick={markAll}
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm" style={{ color: 'var(--muted)' }}>No notifications yet.</div>
            ) : (
              notifications.slice(0, 8).map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => {
  console.log("Button clicked");
  console.log(notification);
  handleSelect(notification);
}}
                  className="w-full text-left p-3 transition-colors border-b last:border-b-0"
                  style={{ borderColor: 'var(--border)', background: notification.read ? 'transparent' : 'rgba(212,175,55,0.08)' }}
                >
                  <div className="flex items-center gap-2">
                    {notification.read ? (
                      <CheckCircle2 size={16} style={{ color: 'var(--gold)' }} />
                    ) : (
                      <CircleDashed size={16} style={{ color: '#D4AF37' }} />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{notification.title}</p>
                      <p className="text-xs" style={{ color: 'var(--muted2)' }}>{notification.message}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
