import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const ADMIN_LINKS = [
  { to: '/admin/dashboard', icon: '📊', label: 'Panel general' },
  { to: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
  { to: '/admin/campanas', icon: '📢', label: 'Campañas' },
  { to: '/admin/kits', icon: '📦', label: 'Catálogo de kits' },
  { to: '/admin/metricas', icon: '📈', label: 'Métricas' },
]

const DONOR_LINKS = [
  { to: '/donante/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/donante/carrito', icon: '🛒', label: 'Donar ahora', cart: true },
  { to: '/donante/donaciones', icon: '📋', label: 'Mis donaciones' },
  { to: '/donante/seguimiento', icon: '📍', label: 'Seguimiento' },
  { to: '/donante/certificados', icon: '📄', label: 'Certificados' },
]

const VALIDADOR_LINKS = [
  { to: '/validador/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/validador/pagos', icon: '✅', label: 'Validar pagos' },
]

const BENEFICIARIO_LINKS = [
  { to: '/beneficiario/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/beneficiario/campanas', icon: '📢', label: 'Mis campañas' },
  { to: '/beneficiario/perfil', icon: '👤', label: 'Mi perfil' },
]

export default function Sidebar({ pendingCount = 0 }) {
  const { user, hasRole, logout } = useAuth()
  const { count: cartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const isAdmin = hasRole('ROLE_ADMIN')
  const links = isAdmin ? ADMIN_LINKS
    : hasRole('ROLE_VALIDADOR') ? VALIDADOR_LINKS
    : hasRole('ROLE_BENEFICIARIO') ? BENEFICIARIO_LINKS
    : DONOR_LINKS

  function handleLogout() {
    logout()
    navigate('/')
  }

  const initials = (user?.fullName || 'US').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className="w-56 bg-green-950 flex flex-col flex-shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/7">
        <Link to="/" className="flex items-center gap-2 text-green-400 font-semibold text-base">
          <span className="w-2 h-2 rounded-full bg-green-400" /> Donatech
        </Link>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-white/7 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isAdmin ? 'bg-orange-700' : 'bg-blue-700'}`}>
          {initials}
        </div>
        <div>
          <div className="text-white/90 text-sm font-medium leading-tight truncate max-w-[120px]">
            {user?.fullName}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${isAdmin ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
            {isAdmin ? 'ADMIN' : 'DONANTE'}
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {links.map(link => {
          const isActive = location.pathname === link.to
          const badge = link.cart ? cartCount : (link.label === 'Campañas' ? pendingCount : 0)
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors relative
                ${isActive
                  ? 'text-green-400 bg-green-400/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
              {badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-white/50 border border-white/15 rounded-md px-3 py-2 hover:text-white hover:border-white/30 transition-colors"
        >
          ← Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
