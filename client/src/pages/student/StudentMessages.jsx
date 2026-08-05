import { useEffect, useState, useRef } from 'react'
import { Send, MessageSquare } from 'lucide-react'
import { getUsers } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../../components/Avatar'
import { PageSpinner } from '../../components/Spinner'
import { timeAgo } from '../../utils/helpers'

export default function StudentMessages() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState({})
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    getUsers().then(({ data }) => {
      setUsers(data.filter((u) => u._id !== user?._id))
    }).finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selected])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !selected) return
    const msg = { id: Date.now(), text: input.trim(), from: 'me', time: new Date().toISOString() }
    setMessages((prev) => ({ ...prev, [selected._id]: [...(prev[selected._id] || []), msg] }))
    setInput('')
  }

  const convo = selected ? (messages[selected._id] || []) : []

  if (loading) return <PageSpinner />

  return (
    <div className="fade-in h-[calc(100vh-8rem)] flex gap-4">
      {/* Sidebar */}
      <div className="w-64 shrink-0 card flex flex-col overflow-hidden">
        <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-semibold text-sm gold-gradient-text">Messages</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 && <p className="text-xs p-3" style={{ color: 'var(--muted)' }}>No users found</p>}
          {users.map((u) => (
            <button
              key={u._id}
              onClick={() => setSelected(u)}
              className="w-full flex items-center gap-2.5 p-3 transition-colors text-left"
              style={{ background: selected?._id === u._id ? 'var(--gold-dim)' : 'transparent' }}
              onMouseEnter={(e) => { if (selected?._id !== u._id) e.currentTarget.style.background = 'var(--surface2)' }}
              onMouseLeave={(e) => { if (selected?._id !== u._id) e.currentTarget.style.background = 'transparent' }}
            >
              <Avatar name={u.name} src={u.profileImage} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: selected?._id === u._id ? 'var(--gold)' : 'var(--text)' }}>{u.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--muted2)' }}>{u.role}</p>
              </div>
              {messages[u._id]?.length > 0 && (
                <span className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--gold)' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 card flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={40} className="mx-auto mb-2" style={{ color: 'var(--gold)' }} />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Select a user to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <Avatar name={selected.name} src={selected.profileImage} size="sm" />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selected.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{selected.role}{selected.college ? ` • ${selected.college}` : ''}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {convo.length === 0 && (
                <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>Start the conversation!</p>
              )}
              {convo.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-xs px-3.5 py-2 rounded-2xl text-sm"
                    style={msg.from === 'me'
                      ? { background: 'linear-gradient(135deg,#D4AF37,#FFD700)', color: '#0B0B0B', borderBottomRightRadius: '4px' }
                      : { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderBottomLeftRadius: '4px' }
                    }
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: msg.from === 'me' ? 'rgba(0,0,0,0.5)' : 'var(--muted2)' }}>
                      {timeAgo(msg.time)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 p-3" style={{ borderTop: '1px solid var(--border)' }}>
              <input
                className="input flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${selected.name}…`}
              />
              <button type="submit" className="btn-primary px-3"><Send size={16} /></button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
