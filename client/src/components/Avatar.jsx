import { getInitials } from '../utils/helpers'

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' }
  const cls = `${sizes[size]} rounded-full flex items-center justify-center font-semibold shrink-0 ${className}`
  if (src) return <img src={src} alt={name} className={`${cls} object-cover`} />
  return (
    <div className={cls} style={{ background: 'linear-gradient(135deg,#D4AF37,#FFD700)', color: '#0B0B0B' }}>
      {getInitials(name)}
    </div>
  )
}
