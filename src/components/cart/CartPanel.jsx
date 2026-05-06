import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../ui'
import { useState } from 'react'

/**
 * CartPanel — panel derecho del carrito con items, totales y checkout
 */
export default function CartPanel({ kits = [] }) {
  const { items, count, total, remove, setQuantity, clear } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  function handleCheckout() {
    setError('')

    if (!items.length) {
      setError('Tu carrito está vacío.')
      return
    }

    // Validar stock actual de cada kit
    for (const item of items) {
      const kit = kits.find(k => k.id === item.id)
      if (kit && item.quantity > kit.stock) {
        setError(`"${item.name}" excede el stock disponible (${kit.stock} unidades).`)
        return
      }
    }

    navigate('/checkout')
  }

  if (!count) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">🛒</div>
        <p className="font-semibold text-gray-700 text-sm mb-1">Tu carrito está vacío</p>
        <p className="text-gray-400 text-xs">Selecciona kits de la izquierda para comenzar</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          Tu carrito
          <span className="bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {count}
          </span>
        </h3>
        <button
          onClick={() => { if (confirm('¿Vaciar el carrito?')) clear() }}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Vaciar
        </button>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 px-5 py-3">
            <span className="text-xl flex-shrink-0">{item.icon}</span>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 truncate">{item.name}</div>
              <div className="text-[11px] text-gray-400">${Number(item.price).toLocaleString('es-CL')} c/u</div>
            </div>

            {/* Qty control */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => item.quantity <= 1 ? remove(item.id) : setQuantity(item.id, item.quantity - 1)}
                className="qty-btn qty-btn--sm"
              >−</button>
              <span className="text-xs font-semibold text-gray-900 w-4 text-center">{item.quantity}</span>
              <button
                onClick={() => setQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="qty-btn qty-btn--sm disabled:opacity-40"
              >+</button>
            </div>

            <div className="text-xs font-semibold text-gray-900 w-16 text-right">
              ${Number(item.price * item.quantity).toLocaleString('es-CL')}
            </div>

            <button
              onClick={() => remove(item.id)}
              className="text-gray-300 hover:text-red-400 text-xs transition-colors ml-1"
              title="Eliminar"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="px-5 py-4 border-t border-gray-100 flex flex-col gap-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal ({count} kit{count !== 1 ? 's' : ''})</span>
          <span>${Number(total).toLocaleString('es-CL')}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Trazabilidad verificada</span>
          <span className="text-green-600 font-medium">100%</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-sm pt-1 border-t border-gray-100 mt-1">
          <span>Total a donar</span>
          <span>${Number(total).toLocaleString('es-CL')}</span>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <button
          onClick={handleCheckout}
          className="w-full mt-2 bg-green-500 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-green-600 transition-colors"
        >
          Proceder al pago →
        </button>

        <p className="text-center text-[10px] text-gray-400 mt-1">
          🔒 Tu donación es 100% trazable
        </p>
      </div>
    </div>
  )
}
