import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
      <input
        className="input pl-9 pr-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
