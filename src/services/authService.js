import { api } from './api'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    return data  // { token, refreshToken, user }
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  async refresh(refreshToken) {
    const { data } = await api.post('/auth/refresh', null, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    })
    return data
  },

  async getMe() {
    const { data } = await api.get('/auth/me')
    return data
  },
}
