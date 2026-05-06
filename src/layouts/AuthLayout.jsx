import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AuthLayout() {
  const { user } = useAuth()

  // Si ya tiene sesión, redirigir a su dashboard
  if (user) {
    const routes = {
      ROLE_ADMIN:        '/admin/dashboard',
      ROLE_DONANTE:      '/donante/dashboard',
      ROLE_EMPRESA:      '/donante/dashboard',
      ROLE_VALIDADOR:    '/validador/dashboard',
      ROLE_BENEFICIARIO: '/beneficiario/dashboard',
    }
    return <Navigate to={routes[user.role] || '/login'} replace />
  }

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-6">
      <Outlet />
    </div>
  )
}
