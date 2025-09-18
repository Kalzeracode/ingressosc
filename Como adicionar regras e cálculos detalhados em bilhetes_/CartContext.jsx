import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}

// Reducer para gerenciar o estado do carrinho
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.ticketId === action.payload.ticketId)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.ticketId === action.payload.ticketId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.ticketId !== action.payload.ticketId)
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.ticketId === action.payload.ticketId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      }
    
    case 'APPLY_PROMO_CODE':
      return {
        ...state,
        promoCode: action.payload
      }
    
    case 'REMOVE_PROMO_CODE':
      return {
        ...state,
        promoCode: null
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        promoCode: null
      }
    
    default:
      return state
  }
}

const initialState = {
  items: [],
  promoCode: null
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Função para adicionar item ao carrinho
  const addItem = (ticketType, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ticketId: ticketType.id,
        ticketType,
        quantity,
        addedAt: new Date()
      }
    })
  }

  // Função para remover item do carrinho
  const removeItem = (ticketId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { ticketId }
    })
  }

  // Função para atualizar quantidade
  const updateQuantity = (ticketId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { ticketId, quantity }
    })
  }

  // Função para aplicar código promocional
  const applyPromoCode = (promoData) => {
    dispatch({
      type: 'APPLY_PROMO_CODE',
      payload: promoData
    })
  }

  // Função para remover código promocional
  const removePromoCode = () => {
    dispatch({
      type: 'REMOVE_PROMO_CODE'
    })
  }

  // Função para limpar carrinho
  const clearCart = () => {
    dispatch({
      type: 'CLEAR_CART'
    })
  }

  // Função para calcular totais do carrinho
  const calculateTotals = (calculatePrice, calculateQuantityDiscount) => {
    const subtotal = state.items.reduce((total, item) => {
      return total + calculatePrice(item.ticketType, item.quantity)
    }, 0)

    const totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0)
    
    // Desconto por quantidade
    const quantityDiscount = calculateQuantityDiscount(totalQuantity, subtotal)
    
    // Desconto do código promocional
    let promoDiscount = 0
    if (state.promoCode && state.promoCode.valid) {
      promoDiscount = state.promoCode.discount
    }
    
    // Total de descontos
    const totalDiscounts = quantityDiscount.amount + promoDiscount
    
    // Total final
    const total = Math.max(0, subtotal - totalDiscounts)
    
    return {
      subtotal,
      totalQuantity,
      quantityDiscount,
      promoDiscount,
      totalDiscounts,
      total,
      items: state.items
    }
  }

  // Função para obter resumo do carrinho
  const getCartSummary = () => {
    const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
    const uniqueItems = state.items.length
    
    return {
      totalItems,
      uniqueItems,
      hasItems: totalItems > 0,
      isEmpty: totalItems === 0
    }
  }

  // Função para validar carrinho antes do checkout
  const validateCart = (ticketTypes) => {
    const errors = []
    
    state.items.forEach(item => {
      const ticketType = ticketTypes.find(t => t.id === item.ticketId)
      
      if (!ticketType) {
        errors.push(`Bilhete ${item.ticketId} não encontrado`)
        return
      }
      
      if (item.quantity > ticketType.available) {
        errors.push(`Apenas ${ticketType.available} bilhetes ${ticketType.name} disponíveis`)
      }
      
      if (item.quantity > ticketType.maxPerPurchase) {
        errors.push(`Máximo ${ticketType.maxPerPurchase} bilhetes ${ticketType.name} por compra`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    clearCart,
    calculateTotals,
    getCartSummary,
    validateCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

