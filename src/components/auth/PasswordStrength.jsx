function getStrength(pwd) {
  if (!pwd) return null
  let score = 0
  if (pwd.length >= 8)  score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 2) return { level: 1, label: 'Débil',   color: 'bg-red-400' }
  if (score <= 3) return { level: 2, label: 'Regular', color: 'bg-amber-400' }
  return             { level: 3, label: 'Segura ✓', color: 'bg-green-500' }
}

export default function PasswordStrength({ password }) {
  const s = getStrength(password)
  if (!s) return null
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= s.level ? s.color : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className={`text-[11px] font-medium ${
        s.level === 1 ? 'text-red-500' : s.level === 2 ? 'text-amber-500' : 'text-green-600'
      }`}>{s.label}</span>
    </div>
  )
}
