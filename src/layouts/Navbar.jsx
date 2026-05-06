import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { isAuthenticated, user, logout, getDashboardPath } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-green-950 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-15 flex items-center justify-between gap-6">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-green-400 font-semibold text-lg">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_0_3px_rgba(74,222,128,.2)]" />
          Donatech
        </Link>

        {/* Links */}
        <ul className="hidden md:flex gap-6 list-none">
          {['Campañas', 'Cómo funciona', 'Nosotros'].map(label => (
            <li key={label}>
              <Link to="/" className="text-white/60 text-sm hover:text-white transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Carrito */}
              <Link to="/cart" className="relative text-white/70 hover:text-white transition-colors">
                <span className="text-lg">🛒</span>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-green-400 text-green-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>

              {/* Nombre usuario */}
              <Link
                to={getDashboardPath()}
                className="text-sm text-white/80 hover:text-white transition-colors hidden sm:block"
              >
                {user?.fullName?.split(' ')[0]}
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm border border-green-400/40 text-green-400 px-3 py-1.5 rounded-md hover:bg-green-400/10 transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm border border-green-400/40 text-green-400 px-3 py-1.5 rounded-md hover:bg-green-400/10 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
