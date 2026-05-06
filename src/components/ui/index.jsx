// ─────────────────────────────────────────────────────────────
// Button.jsx
// ─────────────────────────────────────────────────────────────
export function Button({
  children, variant = 'primary', size = 'md',
  fullWidth = false, loading = false, className = '', ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:  'bg-green-500 text-white hover:bg-green-600',
    outline:  'border border-green-500 text-green-500 hover:bg-green-500/10',
    ghost:    'text-white/60 hover:text-white hover:bg-white/5',
    danger:   'bg-red-500 text-white hover:bg-red-600',
    secondary:'bg-white/10 text-white hover:bg-white/15',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Input.jsx
// ─────────────────────────────────────────────────────────────
import { useState } from 'react'

export function Input({ label, error, hint, type = 'text', className = '', ...props }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <div className="relative">
        <input
          type={isPassword && show ? 'text' : type}
          className={`w-full px-3 py-2.5 text-sm border rounded-md bg-white text-gray-900 placeholder-gray-400 transition-colors
            focus:outline-none focus:border-green-500
            ${error ? 'border-red-400' : 'border-gray-300'}
            ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            {show ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {hint && !error && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Alert.jsx
// ─────────────────────────────────────────────────────────────
export function Alert({ children, variant = 'error', className = '' }) {
  const variants = {
    error:   'bg-red-50 text-red-600 border border-red-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info:    'bg-blue-50 text-blue-700 border border-blue-200',
  }
  if (!children) return null
  return (
    <div className={`px-4 py-3 rounded-md text-sm ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Badge.jsx
// ─────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'green' }) {
  const variants = {
    green:  'bg-green-100 text-green-800',
    red:    'bg-red-100 text-red-700',
    amber:  'bg-amber-100 text-amber-700',
    blue:   'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    gray:   'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${variants[variant]}`}>
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// Spinner.jsx
// ─────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', color = 'green' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  const colors = { green: 'border-green-400', white: 'border-white', gray: 'border-gray-400' }
  return (
    <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  )
}

// ─────────────────────────────────────────────────────────────
// StatCard.jsx
// ─────────────────────────────────────────────────────────────
export function StatCard({ label, value, colorClass = 'text-gray-900' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl font-bold ${colorClass}`}>{value ?? '—'}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Toast.jsx  —  Notificación flotante
// ─────────────────────────────────────────────────────────────
import { useEffect } from 'react'

export function Toast({ message, show, onHide, duration = 4000 }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onHide, duration)
    return () => clearTimeout(t)
  }, [show, onHide, duration])

  if (!show) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-green-950 text-white text-sm px-5 py-3 rounded-xl shadow-xl animate-slide-up flex items-center gap-3">
      <span className="text-green-400">✓</span>
      {message}
    </div>
  )
}
