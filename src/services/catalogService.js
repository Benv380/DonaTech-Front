import { api } from './api'

// ── Catálogo (kits) ──────────────────────────────────────────
export const catalogService = {
  getPublicKits:  ()        => api.get('/catalog/kits/public').then(r => r.data),
  getAllKits:      ()        => api.get('/catalog/kits').then(r => r.data),
  getKitById:     (id)      => api.get(`/catalog/kits/${id}`).then(r => r.data),
  createKit:      (payload) => api.post('/catalog/kits', payload).then(r => r.data),
  updateKit:      (id, payload) => api.put(`/catalog/kits/${id}`, payload).then(r => r.data),
  deactivateKit:  (id)      => api.delete(`/catalog/kits/${id}`),
}

// ── Admin ─────────────────────────────────────────────────────
export const adminService = {
  getStats:          ()           => api.get('/admin/stats').then(r => r.data),
  getPendingCampaigns: ()         => api.get('/admin/campaigns/pending').then(r => r.data),
  approveCampaign:   (id)         => api.patch(`/admin/campaigns/${id}/approve`),
  rejectCampaign:    (id)         => api.patch(`/admin/campaigns/${id}/reject`),
  getUsers:          ()           => api.get('/admin/users').then(r => r.data),
  changeRole:        (id, role)   => api.patch(`/admin/users/${id}/role`, { role }).then(r => r.data),
}

// ── Donante ───────────────────────────────────────────────────
export const donorService = {
  getStats:    () => api.get('/donor/stats').then(r => r.data),
  getOrders:   () => api.get('/donor/orders').then(r => r.data),
}
