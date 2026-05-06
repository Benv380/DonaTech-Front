// ─────────────────────────────────────────────────────────────
// services/api.js  —  Cliente HTTP centralizado con Axios
// ─────────────────────────────────────────────────────────────
import axios from 'axios'

const API_GATEWAY = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ baseURL: API_GATEWAY })

// Interceptor request: agrega JWT automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('dt_token') || sessionStorage.getItem('dt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor response: maneja 401 global
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      ;['dt_token', 'dt_user', 'dt_remember'].forEach(k => {
        localStorage.removeItem(k); sessionStorage.removeItem(k)
      })
      window.location.href = '/login?expired=true'
    }
    return Promise.reject(err)
  }
)
