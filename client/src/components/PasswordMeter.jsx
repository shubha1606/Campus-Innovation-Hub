import { passwordStrength } from '../utils/helpers'

export default function PasswordMeter({ password }) {
  const { score, label, color } = passwordStrength(password)
  if (!password) return null
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? color : 'var(--border)' }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color }}>{label}</p>
    </div>
  )
}
