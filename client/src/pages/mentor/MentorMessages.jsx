import { useEffect, useState, useRef } from 'react'
import { Send, MessageSquare, Paperclip, Search, X } from 'lucide-react'
import { getChatUsers, getMessages, createMessage, uploadMessageAttachment } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import Avatar from '../../components/Avatar'
import { PageSpinner } from '../../components/Spinner'
import { timeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ATTACHMENT_HOST = 'http://localhost:5000'

export default function MentorMessages() {
  const { user, role } = useAuth()
  const { socket } = useSocket()
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatLoading, setChatLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    getChatUsers()
      .then(({ data }) => setContacts(data))
      .catch(() => toast.error('Unable to load chats'))
      .finally(() => setLoading(false))
  }, [])

  const filteredContacts = contacts.filter((contact) =>
    contact.name?.toLowerCase().includes(search.toLowerCase()) ||
    contact.email?.toLowerCase().includes(search.toLowerCase()) ||
    (contact.role || contact.model)?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (!selected) {
      setMessages([])
      return
    }

    setChatLoading(true)
    getMessages(selected._id, selected.model)
      .then(({ data }) => setMessages(data || []))
      .catch(() => toast.error('Unable to load conversation'))
      .finally(() => setChatLoading(false))
  }, [selected])

  useEffect(() => {
    if (!socket || !selected) return

    const currentModel = role === 'mentor' ? 'Mentor' : 'User'

    const handleNewMessage = (message) => {
      const isConversationMessage =
        (message.sender === selected._id && message.senderModel === selected.model && message.receiver === user._id && message.receiverModel === currentModel) ||
        (message.receiver === selected._id && message.receiverModel === selected.model && message.sender === user._id && message.senderModel === currentModel)

      if (isConversationMessage) {
        setMessages((prev) => [...prev, message])
      }
    }

    socket.on('newMessage', handleNewMessage)
    return () => socket.off('newMessage', handleNewMessage)
  }, [socket, selected, user, role])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selected])

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const { data } = await uploadMessageAttachment(formData)
      setAttachment(data.attachment)
      toast.success('Attachment uploaded')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload file')
    }
  }

  const removeAttachment = () => setAttachment(null)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!selected) return
    if (!input.trim() && !attachment) {
      toast.error('Enter a message or attach a file')
      return
    }

    setSending(true)
    try {
      const payload = {
        receiverId: selected._id,
        receiverModel: selected.model,
        text: input.trim(),
        attachment,
      }
      const { data } = await createMessage(payload)
      setMessages((prev) => [...prev, data.data])
      setInput('')
      setAttachment(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="fade-in h-[calc(100vh-8rem)] flex gap-4">
      <div className="w-64 shrink-0 card flex flex-col overflow-hidden">
        <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-semibold text-sm gold-gradient-text">Chats</p>
          <div className="mt-3 flex items-center gap-2 rounded-xl border bg-surface2 p-2" style={{ borderColor: 'var(--border)' }}>
            <Search size={14} style={{ color: 'var(--muted2)' }} />
            <input
              className="input bg-transparent border-0 p-0 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts…"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 && <p className="text-xs p-3" style={{ color: 'var(--muted)' }}>No contacts found</p>}
          {filteredContacts.map((contact) => (
            <button
              key={contact._id}
              onClick={() => setSelected(contact)}
              className="w-full flex items-center gap-2.5 p-3 transition-colors text-left"
              style={{ background: selected?._id === contact._id ? 'var(--gold-dim)' : 'transparent' }}
              onMouseEnter={(e) => { if (selected?._id !== contact._id) e.currentTarget.style.background = 'var(--surface2)' }}
              onMouseLeave={(e) => { if (selected?._id !== contact._id) e.currentTarget.style.background = 'transparent' }}
            >
              <Avatar name={contact.name} src={contact.profileImage} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: selected?._id === contact._id ? 'var(--gold)' : 'var(--text)' }}>{contact.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--muted2)' }}>{contact.role || contact.model}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 card flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={40} className="mx-auto mb-2" style={{ color: 'var(--gold)' }} />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <Avatar name={selected.name} src={selected.profileImage} size="sm" />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{selected.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{selected.role || selected.model}{selected.college ? ` • ${selected.college}` : ''}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatLoading ? (
                <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>Loading conversation…</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>Start the conversation!</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id || msg.id || `${msg.sender}-${msg.createdAt}`} className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-xs px-3.5 py-2 rounded-2xl text-sm" style={msg.sender === user._id ? { background: 'linear-gradient(135deg,#D4AF37,#FFD700)', color: '#0B0B0B', borderBottomRightRadius: '4px' } : { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderBottomLeftRadius: '4px' }}>
                      {msg.text && <p>{msg.text}</p>}
                      {msg.attachment && (
                        <div className="mt-2 rounded-xl border p-2" style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'rgba(212,175,55,0.06)' }}>
                          <a href={`${ATTACHMENT_HOST}${msg.attachment.url}`} target="_blank" rel="noreferrer" className="font-semibold text-sm" style={{ color: 'var(--gold)' }}>
                            {msg.attachment.filename}
                          </a>
                          <p className="text-xs" style={{ color: 'var(--muted2)' }}>{Math.round(msg.attachment.size / 1024)} KB</p>
                        </div>
                      )}
                      <p className="text-xs mt-0.5" style={{ color: msg.sender === user._id ? 'rgba(0,0,0,0.5)' : 'var(--muted2)' }}>
                        {timeAgo(msg.createdAt || msg.time)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={handleSendMessage} className="space-y-3 p-3" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${selected.name}…`}
                />
                <label className="btn-secondary flex items-center gap-2 px-3 cursor-pointer">
                  <Paperclip size={16} /> Attach
                  <input type="file" className="hidden" onChange={handleFileSelect} />
                </label>
              </div>
              {attachment && (
                <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{attachment.filename}</p>
                    <p className="text-xs" style={{ color: 'var(--muted2)' }}>{Math.round(attachment.size / 1024)} KB</p>
                  </div>
                  <button type="button" className="text-xs text-red-500" onClick={removeAttachment}><X size={16} /></button>
                </div>
              )}
              <div className="flex justify-end">
                <button type="submit" className="btn-primary" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
