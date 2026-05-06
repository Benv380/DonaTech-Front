import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems]             = useState([])
  const [beneficiary, setBeneficiary] = useState(null)

  // Restaurar carrito de sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('dt_cart')
      const storedBenef = sessionStorage.getItem('dt_cart_beneficiary')
      if (stored) setItems(JSON.parse(stored))
      if (storedBenef) setBeneficiary(JSON.parse(storedBenef))
    } catch { /* ignorar */ }
  }, [])

  // Persistir en sessionStorage cada vez que cambie
  useEffect(() => {
    sessionStorage.setItem('dt_cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (beneficiary) sessionStorage.setItem('dt_cart_beneficiary', JSON.stringify(beneficiary))
    else sessionStorage.removeItem('dt_cart_beneficiary')
  }, [beneficiary])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const getQuantity = useCallback((kitId) => {
    return items.find(i => i.id === kitId)?.quantity ?? 0
  }, [items])

  const add = useCallback((kit) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === kit.id)
      if (existing) {
        if (existing.quantity >= kit.stock) return prev
        return prev.map(i => i.id === kit.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { id: kit.id, name: kit.name, price: kit.price, icon: kit.icon || '📦', stock: kit.stock, quantity: 1 }]
    })
  }, [])

  const remove = useCallback((kitId) => {
    setItems(prev => prev.filter(i => i.id !== kitId))
  }, [])

  const setQuantity = useCallback((kitId, qty) => {
    if (qty <= 0) { remove(kitId); return }
    setItems(prev => prev.map(i => {
      if (i.id !== kitId) return i
      return { ...i, quantity: Math.min(qty, i.stock) }
    }))
  }, [remove])

  const clear = useCallback(() => {
    setItems([])
    setBeneficiary(null)
  }, [])

  const setCartBeneficiary = useCallback((id, name) => {
    setBeneficiary({ id, name })
  }, [])

  const toOrderPayload = useCallback(() => ({
    beneficiaryId: beneficiary?.id ?? null,
    items: items.map(i => ({ kitId: i.id, quantity: i.quantity })),
    total,
  }), [items, beneficiary, total])

  return (
    <CartContext.Provider value={{
      items, count, total, beneficiary,
      getQuantity, add, remove, setQuantity, clear,
      setCartBeneficiary, clearBeneficiary: () => setBeneficiary(null),
      toOrderPayload,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
