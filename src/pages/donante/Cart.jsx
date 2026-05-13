import { useEffect, useState } from 'react'
import { catalogService } from '../../services/catalogService'
import KitCard from '../../components/kit/KitCard'
import CartPanel from '../../components/cart/CartPanel'

const MOCK_KITS = [
  { id: 'kit-001', name: 'Kit Alimentario Básico', icon: '🍞', price: 35000, stock: 12, description: 'Arroz, fideos, aceite, legumbres y conservas para una semana.', products: ['Arroz 5kg', 'Fideos', 'Aceite 1L', 'Lentejas', 'Porotos'] },
  { id: 'kit-002', name: 'Kit Emergencia Hogar', icon: '🏠', price: 62000, stock: 5, description: 'Frazadas, velas, linterna y botiquín básico.', products: ['Frazada', 'Velas x10', 'Linterna', 'Botiquín'] },
  { id: 'kit-003', name: 'Kit Escolar', icon: '🧒', price: 28500, stock: 8, description: 'Cuadernos, lápices, mochila y útiles.', products: ['Cuadernos x5', 'Lápices x12', 'Mochila', 'Regla', 'Borrador'] },
  { id: 'kit-004', name: 'Kit Salud Básica', icon: '💊', price: 22000, stock: 2, description: 'Medicamentos esenciales y mascarillas.', products: ['Paracetamol', 'Ibuprofeno', 'Mascarillas', 'Gasas', 'Alcohol'] },
  { id: 'kit-005', name: 'Kit Higiene Familiar', icon: '🧼', price: 18000, stock: 15, description: 'Productos de higiene para toda la familia.', products: ['Jabón x4', 'Champú', 'Pasta dental x2', 'Desodorante', 'Papel higiénico'] },
  { id: 'kit-006', name: 'Kit Bebé', icon: '👶', price: 45000, stock: 3, description: 'Artículos esenciales para bebés hasta 1 año.', products: ['Pañales S x30', 'Leche fórmula', 'Ropa x3', 'Crema', 'Toallitas'] },
]

export function CartPage() {
  const [kits, setKits]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [sort, setSort]       = useState('default')

  useEffect(() => {
    catalogService.getAllKits()
      .then(setKits)
      .catch(() => setKits(MOCK_KITS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = kits
    .filter(k => !search || k.name.toLowerCase().includes(search.toLowerCase()) || k.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'name')       return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

        {/* ── Kits disponibles ── */}
        <div>
          <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
            <h2 className="text-xl font-bold text-gray-900">Kits disponibles</h2>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Buscar kit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-white"
              />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-white"
              >
                <option value="default">Ordenar por...</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre A–Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 h-52 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400 text-sm py-8">No se encontraron kits.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(kit => <KitCard key={kit.id} kit={kit} />)}
            </div>
          )}
        </div>

        {/* ── Panel carrito ── */}
        <div className="lg:sticky lg:top-20">
          <CartPanel kits={kits} />
        </div>

      </div>
    </div>
  )
}
