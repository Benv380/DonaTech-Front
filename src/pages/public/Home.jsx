import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { catalogService } from '../../services/catalogService'
import Navbar from '../../layouts/Navbar'
import KitCard from '../../components/kit/KitCard'
import { Toast } from '../../components/ui'

const MOCK_KITS = [
  { id: 'kit-001', name: 'Kit Alimentario', icon: '🍞', price: 35000, stock: 12, description: 'Arroz, fideos, aceite y conservas.', products: ['Arroz 5kg', 'Fideos', 'Aceite', 'Lentejas'] },
  { id: 'kit-002', name: 'Kit Emergencia Hogar', icon: '🏠', price: 62000, stock: 5, description: 'Frazadas, linterna y botiquín.', products: ['Frazada', 'Linterna', 'Botiquín'] },
  { id: 'kit-003', name: 'Kit Escolar', icon: '🧒', price: 28500, stock: 8, description: 'Útiles para el año escolar.', products: ['Cuadernos', 'Lápices', 'Mochila'] },
  { id: 'kit-004', name: 'Kit Salud Básica', icon: '💊', price: 22000, stock: 2, description: 'Medicamentos esenciales.', products: ['Paracetamol', 'Mascarillas', 'Gasas'] },
  { id: 'kit-005', name: 'Kit Higiene', icon: '🧼', price: 18000, stock: 15, description: 'Productos de higiene familiar.', products: ['Jabón', 'Champú', 'Pasta dental'] },
  { id: 'kit-006', name: 'Kit Bebé', icon: '👶', price: 45000, stock: 3, description: 'Artículos esenciales para bebé.', products: ['Pañales', 'Leche fórmula', 'Ropa'] },
]

export function Home() {
  const [kits, setKits] = useState([])
  const [loading, setLoading] = useState(true)
  const { count } = useCart()
  const [prevCount, setPrevCount] = useState(count)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    catalogService.getPublicKits()
      .then(setKits)
      .catch(() => setKits(MOCK_KITS))
      .finally(() => setLoading(false))
  }, [])

  // Mostrar toast cuando se agrega al carrito
  useEffect(() => {
    if (count > prevCount) setShowToast(true)
    setPrevCount(count)
  }, [count])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-950 via-green-800 to-green-600 px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Dona con transparencia,<br />cambia vidas con confianza
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
            Conectamos donantes con familias vulnerables en Chile, con trazabilidad completa en 4 etapas verificadas.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#kits" className="bg-green-400 text-green-950 font-semibold px-6 py-3 rounded-lg hover:bg-green-300 transition-colors">
              Ver kits disponibles
            </a>
            <Link to="/register?rol=beneficiario" className="border border-white/40 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              ¿Necesitas ayuda?
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white border-b border-gray-200 grid grid-cols-3">
        {[
          { n: '1.247', l: 'Familias ayudadas' },
          { n: '$48M',  l: 'Donado en total' },
          { n: '98%',   l: 'Trazabilidad verificada' },
        ].map(s => (
          <div key={s.l} className="py-5 text-center border-r border-gray-200 last:border-r-0">
            <div className="text-2xl font-bold text-green-700">{s.n}</div>
            <div className="text-xs text-gray-500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Kits */}
      <section id="kits" className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kits disponibles para donar</h2>
        <p className="text-gray-500 text-sm mb-8">Cada kit está compuesto por productos esenciales verificados.</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kits.map(kit => <KitCard key={kit.id} kit={kit} compact />)}
          </div>
        )}
      </section>

      {/* Cómo funciona */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Cómo funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { n: '01', t: 'Elige un kit', d: 'Selecciona uno o más kits para la familia.' },
              { n: '02', t: 'Realiza la donación', d: 'Paga por transferencia y adjunta el comprobante.' },
              { n: '03', t: 'Validamos el pago', d: 'Verificamos el comprobante en menos de 24 horas.' },
              { n: '04', t: 'Seguimiento', d: 'Rastrea tu donación hasta que llegue a la familia.' },
            ].map(s => (
              <div key={s.n} className="text-center md:text-left">
                <div className="text-4xl font-black text-green-400 mb-3">{s.n}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.t}</h3>
                <p className="text-gray-500 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-green-400 font-semibold mb-2">
          <span className="w-2 h-2 rounded-full bg-green-400" /> Donatech
        </div>
        <p className="text-white/40 text-xs">Plataforma solidaria · Chile © 2024</p>
      </footer>

      <Toast
        message={<>Kit agregado — <Link to="/cart" className="underline text-green-400">Ver carrito</Link></>}
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  )
}
