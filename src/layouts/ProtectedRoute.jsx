import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute
 * - Si no está autenticado → redirige a /login
 * - Si tiene roles requeridos y no coincide → redirige a /unauthorized
 * - Si pasa todo → renderiza children
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, hasAnyRole, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-green-400 text-sm">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles.length > 0 && !hasAnyRole(roles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
