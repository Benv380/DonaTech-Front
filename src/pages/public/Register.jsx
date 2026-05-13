import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Input, Alert, Button } from '../../components/ui'
import RoleSelector from '../../components/auth/RoleSelector'
import PasswordStrength from '../../components/auth/PasswordStrength'

export function RegisterPage() {
  const { register, isAuthenticated, getDashboardPath } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    role: 'ROLE_DONANTE', rutEmpresa: '', terms: false,
  })
  const [errors, setErrors]     = useState({})
  const [globalErr, setGlobalErr] = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate(getDashboardPath(), { replace: true })
  }, [isAuthenticated])

  // Pre-seleccionar rol desde URL (?rol=beneficiario)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const rolMap = { donante: 'ROLE_DONANTE', beneficiario: 'ROLE_BENEFICIARIO', empresa: 'ROLE_EMPRESA' }
    const rol = rolMap[params.get('rol')]
    if (rol) setForm(f => ({ ...f, role: rol }))
  }, [])

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  function validate() {
    const e = {}
    if (!form.fullName || form.fullName.trim().length < 3) e.fullName = 'Mínimo 3 caracteres'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido'
    if (!form.password || form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    if (form.role === 'ROLE_EMPRESA' && !form.rutEmpresa) e.rutEmpresa = 'RUT obligatorio'
    if (!form.terms) e.terms = 'Debes aceptar los términos'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGlobalErr('')
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.role === 'ROLE_EMPRESA' && { rutEmpresa: form.rutEmpresa }),
      }
      await register(payload)
      navigate('/login?registered=true')
    } catch (err) {
      setGlobalErr(err.response?.data?.message || 'Error al crear la cuenta. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-6">
      <Link to="/" className="absolute top-5 left-5 text-white/50 text-sm hover:text-white transition-colors">
        ← Volver
      </Link>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-xl mb-7">
          <span className="w-2 h-2 rounded-full bg-green-400" /> Donatech
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mb-6">Únete a la comunidad solidaria</p>

          {globalErr && <Alert variant="error" className="mb-4">{globalErr}</Alert>}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <RoleSelector
              value={form.role}
              onChange={role => setForm(f => ({ ...f, role }))}
            />

            <Input label="Nombre completo" type="text" placeholder="Tu nombre completo"
              value={form.fullName} onChange={set('fullName')} error={errors.fullName} />

            <Input label="Correo electrónico" type="email" placeholder="tu@email.com"
              value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />

            <div>
              <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres"
                value={form.password} onChange={set('password')} error={errors.password} />
              <PasswordStrength password={form.password} />
            </div>

            <Input label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña"
              value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />

            {form.role === 'ROLE_EMPRESA' && (
              <Input label="RUT Empresa" type="text" placeholder="12.345.678-9"
                value={form.rutEmpresa} onChange={set('rutEmpresa')} error={errors.rutEmpresa}
                hint="Requerido para certificado de donación (Ley 16.282)" />
            )}

            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={form.terms}
                  onChange={e => setForm(f => ({ ...f, terms: e.target.checked }))}
                  className="accent-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Acepto los{' '}
                  <Link to="/terms" target="_blank" className="text-green-700 hover:underline">Términos y Condiciones</Link>
                  {' '}y la{' '}
                  <Link to="/privacy" target="_blank" className="text-green-700 hover:underline">Política de Privacidad</Link>
                </span>
              </label>
              {errors.terms && <span className="text-xs text-red-500">{errors.terms}</span>}
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-green-700 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
