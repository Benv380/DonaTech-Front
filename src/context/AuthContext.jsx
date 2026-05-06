import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Restaurar sesión al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem('dt_token') || sessionStorage.getItem('dt_token')
    const storedUser  = localStorage.getItem('dt_user')  || sessionStorage.getItem('dt_user')
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        // Validar que el token no haya expirado
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) {
          setToken(storedToken)
          setUser(parsed)
        } else {
          clearSession()
        }
      } catch { clearSession() }
    }
    setLoading(false)
  }, [])

  function saveSession(newToken, newUser, remember = false) {
    const storage = remember ? localStorage : sessionStorage
    if (remember) localStorage.setItem('dt_remember', 'true')
    storage.setItem('dt_token', newToken)
    storage.setItem('dt_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  function clearSession() {
    ;['dt_token', 'dt_user', 'dt_remember'].forEach(k => {
      localStorage.removeItem(k)
      sessionStorage.removeItem(k)
    })
    setToken(null)
    setUser(null)
  }

  const login = useCallback(async (email, password, remember) => {
    const result = await authService.login(email, password)
    saveSession(result.token, result.user, remember)
    return result.user
  }, [])

  const register = useCallback(async (payload) => {
    return authService.register(payload)
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [])

  function hasRole(role) {
    return user?.roles?.includes(role) ?? false
  }

  function hasAnyRole(roles) {
    return roles.some(r => hasRole(r))
  }

  function getDashboardPath() {
    if (!user) return '/login'
    if (hasRole('ROLE_ADMIN')) return '/dashboard/admin'
    return '/dashboard'
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      isAuthenticated: !!token,
      hasRole, hasAnyRole,
      getDashboardPath,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
