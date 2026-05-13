import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Unauthorized() {
  const { isAuthenticated, getDashboardPath } = useAuth()
  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-6 text-center">
      <div>
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Sin permisos</h1>
        <p className="text-white/60 text-sm mb-6">No tienes acceso a esta sección.</p>
        <Link
          to={isAuthenticated ? getDashboardPath() : '/login'}
          className="bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
        >
          {isAuthenticated ? 'Ir a mi panel' : 'Iniciar sesión'}
        </Link>
      </div>
    </div>
  )
}
