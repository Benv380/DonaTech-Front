import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from 'src/public/context/AuthContext'
import { Input, Alert, Button } from 'src/components/ui'

export default function Login() {
  const { login, isAuthenticated, getDashboardPath } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || null

  const [form, setForm]     = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [globalErr, setGlobalErr] = useState('')
  const [loading, setLoading]     = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) navigate(getDashboardPath(), { replace: true })
  }, [isAuthenticated])

  // Mensaje post-registro
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('registered') === 'true') setSuccessMsg('¡Cuenta creada! Inicia sesión.')
    if (params.get('expired') === 'true')    setGlobalErr('Tu sesión expiró. Inicia sesión nuevamente.')
  }, [])

  function validate() {
    const e = {}
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido'
    if (!form.password || form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGlobalErr('')
    if (!validate()) return
    setLoading(true)
    try {
      const user = await login(form.email, form.password, form.remember)
      const dest = from || (user.roles?.includes('ROLE_ADMIN') ? '/dashboard/admin' : '/dashboard')
      navigate(dest, { replace: true })
    } catch (err) {
      setGlobalErr(err.response?.data?.message || 'Credenciales incorrectas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-6">
      <Link to="/" className="absolute top-5 left-5 text-white/50 text-sm hover:text-white transition-colors">
        ← Volver
      </Link>

      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-xl mb-7">
          <span className="w-2 h-2 rounded-full bg-green-400" /> Donatech
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm mb-6">Accede a tu cuenta Donatech</p>

          {successMsg && <Alert variant="success" className="mb-4">{successMsg}</Alert>}
          {globalErr   && <Alert variant="error"   className="mb-4">{globalErr}</Alert>}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                  className="accent-green-500 w-3.5 h-3.5"
                />
                Recordarme
              </label>
              <Link to="/forgot-password" className="text-green-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Iniciar sesión
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-green-700 font-medium hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
