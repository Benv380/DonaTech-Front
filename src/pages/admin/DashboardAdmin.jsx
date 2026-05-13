import { useEffect, useState } from 'react'
import { StatCard, Badge, Spinner } from '../../components/ui'
import { adminService } from '../../services/catalogService'

export default function DashboardAdmin() {
  const [stats, setStats]         = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [s, c, u] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingCampaigns(),
        adminService.getUsers(),
      ])
      setStats(s); setCampaigns(c); setUsers(u)
    } catch {
      // Mock para desarrollo sin backend
      setStats({ activeCampaigns: 142, pendingApprovals: 7, totalUsers: 384, monthlyDonations: 4800000 })
      setCampaigns([
        { id: '1', beneficiaryName: 'Familia López', description: 'Necesitan kit alimentario urgente', createdAt: new Date() },
        { id: '2', beneficiaryName: 'Familia Soto', description: 'Daño en vivienda por lluvia', createdAt: new Date() },
      ])
      setUsers([
        { id: '1', fullName: 'María Rodríguez', email: 'maria@example.com', role: 'ROLE_DONANTE', enabled: true },
        { id: '2', fullName: 'Carlos Pérez', email: 'carlos@example.com', role: 'ROLE_BENEFICIARIO', enabled: true },
      ])
    } finally { setLoading(false) }
  }

  async function approveCampaign(id) {
    if (!confirm('¿Aprobar esta campaña?')) return
    try { await adminService.approveCampaign(id); await loadAll() } catch { alert('Error al aprobar') }
  }
  async function rejectCampaign(id) {
    if (!confirm('¿Rechazar esta campaña?')) return
    try { await adminService.rejectCampaign(id); await loadAll() } catch { alert('Error al rechazar') }
  }
  async function changeRole(userId, role) {
    try { await adminService.changeRole(userId, role); alert('Rol actualizado') } catch { alert('Error') }
  }

  const ROLE_COLORS = { ROLE_ADMIN: 'red', ROLE_VALIDADOR: 'amber', ROLE_DONANTE: 'green', ROLE_EMPRESA: 'blue', ROLE_BENEFICIARIO: 'purple' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
          <span className="text-sm text-gray-400">{new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" color="gray" /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Campañas activas"   value={stats?.activeCampaigns} />
              <StatCard label="Pendientes validar" value={stats?.pendingApprovals} colorClass="text-amber-600" />
              <StatCard label="Total usuarios"     value={stats?.totalUsers} />
              <StatCard label="Donado este mes"    value={stats?.monthlyDonations ? `$${Number(stats.monthlyDonations).toLocaleString('es-CL')}` : '—'} colorClass="text-green-700" />
            </div>

            {/* Campañas pendientes */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Campañas pendientes de aprobación
              </h2>
              {campaigns.length === 0 ? (
                <p className="text-gray-400 text-sm">No hay campañas pendientes.</p>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Beneficiario', 'Descripción', 'Fecha', 'Acciones'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {campaigns.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-900">{c.beneficiaryName}</td>
                          <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{c.description}</td>
                          <td className="px-5 py-3 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString('es-CL')}</td>
                          <td className="px-5 py-3 flex gap-2">
                            <button onClick={() => approveCampaign(c.id)} className="px-3 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium hover:bg-green-100 transition-colors">Aprobar</button>
                            <button onClick={() => rejectCampaign(c.id)}  className="px-3 py-1 bg-red-50   text-red-600   rounded-md text-xs font-medium hover:bg-red-100   transition-colors">Rechazar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Usuarios */}
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Gestión de usuarios</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Nombre', 'Email', 'Rol', 'Cambiar rol'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-900">{u.fullName}</td>
                        <td className="px-5 py-3 text-gray-500">{u.email}</td>
                        <td className="px-5 py-3"><Badge variant={ROLE_COLORS[u.role] || 'gray'}>{u.role.replace('ROLE_', '')}</Badge></td>
                        <td className="px-5 py-3">
                          <select
                            defaultValue={u.role}
                            onChange={e => changeRole(u.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:border-green-500"
                          >
                            {['ROLE_DONANTE','ROLE_VALIDADOR','ROLE_BENEFICIARIO','ROLE_EMPRESA'].map(r => (
                              <option key={r} value={r}>{r.replace('ROLE_','')}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
    </div>
  )
}
