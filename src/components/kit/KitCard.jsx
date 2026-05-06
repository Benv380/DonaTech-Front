import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

/**
 * KitCard — muestra un kit disponible.
 * Props:
 *   kit: { id, name, description, icon, price, stock, products }
 *   compact?: boolean  — versión pequeña para el home
 */
export default function KitCard({ kit, compact = false }) {
  const { add, getQuantity, setQuantity, remove } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const qty = getQuantity(kit.id)
  const isOut = kit.stock === 0
  const isLow = kit.stock > 0 && kit.stock <= 3

  function handleAdd() {
    if (!isAuthenticated) { navigate('/login?redirect=/cart'); return }
    if (qty >= kit.stock) return
    add(kit)
  }

  function handleInc() { if (qty < kit.stock) setQuantity(kit.id, qty + 1) }
  function handleDec() { if (qty <= 1) remove(kit.id); else setQuantity(kit.id, qty - 1) }

  if (compact) {
    return (
      <div className={`bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:border-green-300 hover:shadow-sm transition-all ${isOut ? 'opacity-60' : ''}`}>
        <div className="text-3xl">{kit.icon || '📦'}</div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">{kit.name}</div>
          <div className="text-green-700 font-bold text-sm mt-0.5">
            ${Number(kit.price).toLocaleString('es-CL')}
          </div>
        </div>
        {qty > 0 ? (
          <div className="flex items-center gap-2">
            <button onClick={handleDec} className="qty-btn">−</button>
            <span className="text-sm font-semibold w-5 text-center">{qty}</span>
            <button onClick={handleInc} disabled={qty >= kit.stock} className="qty-btn">+</button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={isOut}
            className="w-full bg-green-50 border border-green-300 text-green-700 text-xs font-medium py-1.5 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isOut ? 'Sin stock' : '+ Agregar'}
          </button>
        )}
      </div>
    )
  }

  // Versión completa (para cart.html)
  return (
    <div className={`bg-white border rounded-xl p-5 flex flex-col gap-4 transition-all
      ${isOut ? 'opacity-60' : 'hover:border-green-300 hover:shadow-sm border-gray-200'}`}>

      {/* Header */}
      <div className="flex gap-3 items-start">
        <div className="text-3xl flex-shrink-0">{kit.icon || '📦'}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm leading-tight">{kit.name}</div>
          <div className="text-gray-500 text-xs mt-1 line-clamp-2">{kit.description}</div>
        </div>
      </div>

      {/* Productos incluidos */}
      {kit.products?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] text-gray-400 w-full mb-0.5">Incluye:</span>
          {kit.products.slice(0, 4).map((p, i) => (
            <span key={i} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{p}</span>
          ))}
          {kit.products.length > 4 && (
            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
              +{kit.products.length - 4} más
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-end justify-between mt-auto">
        <div>
          <div className="text-lg font-bold text-green-700">
            ${Number(kit.price).toLocaleString('es-CL')}
          </div>
          <div className={`text-[11px] mt-0.5 ${isOut ? 'text-red-500 font-medium' : isLow ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
            {isOut ? 'Sin stock' : isLow ? `⚠ Solo ${kit.stock} disponibles` : `${kit.stock} disponibles`}
          </div>
        </div>

        {isOut ? (
          <button disabled className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs rounded-md cursor-not-allowed">
            Sin stock
          </button>
        ) : qty > 0 ? (
          <div className="flex items-center gap-2">
            <button onClick={handleDec} className="qty-btn">−</button>
            <span className="text-sm font-semibold w-5 text-center text-gray-900">{qty}</span>
            <button onClick={handleInc} disabled={qty >= kit.stock} className="qty-btn disabled:opacity-40">+</button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-md hover:bg-green-600 transition-colors"
          >
            + Agregar
          </button>
        )}
      </div>
    </div>
  )
}
