import { createContext, useContext, useState } from 'react'

const TicketContext = createContext()

export const useTickets = () => {
  const context = useContext(TicketContext)
  if (!context) {
    throw new Error('useTickets deve ser usado dentro de um TicketProvider')
  }
  return context
}

export const TicketProvider = ({ children }) => {
  // Dados dos tipos de bilhetes disponíveis
  const [ticketTypes] = useState([
    {
      id: 'standard',
      name: 'Bilhete Padrão',
      description: 'Acesso completo ao evento com todas as atividades principais.',
      basePrice: 150.00,
      features: [
        'Acesso a todas as palestras',
        'Material do evento',
        'Coffee break',
        'Certificado de participação'
      ],
      available: 500,
      maxPerPurchase: 10,
      category: 'standard'
    },
    {
      id: 'vip',
      name: 'Bilhete VIP',
      description: 'Experiência premium com acesso exclusivo e benefícios especiais.',
      basePrice: 300.00,
      features: [
        'Todos os benefícios do bilhete padrão',
        'Acesso à área VIP',
        'Meet & greet com palestrantes',
        'Jantar exclusivo',
        'Kit premium',
        'Estacionamento gratuito'
      ],
      available: 100,
      maxPerPurchase: 5,
      category: 'premium'
    },
    {
      id: 'student',
      name: 'Bilhete Estudante',
      description: 'Desconto especial para estudantes com comprovação.',
      basePrice: 150.00,
      discountPercent: 50,
      features: [
        'Todos os benefícios do bilhete padrão',
        '50% de desconto',
        'Necessária comprovação de matrícula'
      ],
      available: 200,
      maxPerPurchase: 2,
      category: 'discount',
      requiresValidation: true
    },
    {
      id: 'senior',
      name: 'Bilhete Idoso',
      description: 'Desconto especial para pessoas acima de 60 anos.',
      basePrice: 150.00,
      discountPercent: 30,
      features: [
        'Todos os benefícios do bilhete padrão',
        '30% de desconto',
        'Necessária comprovação de idade'
      ],
      available: 150,
      maxPerPurchase: 4,
      category: 'discount',
      requiresValidation: true
    },
    {
      id: 'child',
      name: 'Bilhete Infantil',
      description: 'Para crianças de 6 a 12 anos. Menores de 6 anos não pagam.',
      basePrice: 50.00,
      features: [
        'Acesso às atividades infantis',
        'Kit especial para crianças',
        'Acompanhamento pedagógico',
        'Lanche especial'
      ],
      available: 100,
      maxPerPurchase: 6,
      category: 'special',
      ageRange: '6-12 anos'
    }
  ])

  // Configurações de preços dinâmicos
  const [pricingRules] = useState({
    earlyBird: {
      active: true,
      discountPercent: 15,
      endDate: new Date('2024-12-31'),
      description: 'Desconto de lançamento'
    },
    lastMinute: {
      active: false,
      surchargePercent: 20,
      startDate: new Date('2025-01-15'),
      description: 'Taxa de última hora'
    },
    weekendSurcharge: {
      active: true,
      surchargePercent: 10,
      description: 'Taxa de fim de semana'
    }
  })

  // Códigos promocionais disponíveis
  const [promoCodes] = useState({
    'PROMO10': {
      type: 'percentage',
      value: 10,
      description: 'Desconto de 10%',
      active: true,
      usageLimit: 100,
      usageCount: 0
    },
    'SAVE50': {
      type: 'fixed',
      value: 50,
      description: 'R$ 50 de desconto',
      active: true,
      usageLimit: 50,
      usageCount: 0
    },
    'GRUPO20': {
      type: 'percentage',
      value: 20,
      description: 'Desconto para grupos (mín. 5 bilhetes)',
      active: true,
      minQuantity: 5,
      usageLimit: 20,
      usageCount: 0
    }
  })

  // Função para calcular preço com base nas regras
  const calculatePrice = (ticketType, quantity = 1, isWeekend = false) => {
    let price = ticketType.basePrice
    
    // Aplicar desconto do tipo de bilhete
    if (ticketType.discountPercent) {
      price = price * (1 - ticketType.discountPercent / 100)
    }
    
    // Aplicar desconto early bird
    if (pricingRules.earlyBird.active && new Date() < pricingRules.earlyBird.endDate) {
      price = price * (1 - pricingRules.earlyBird.discountPercent / 100)
    }
    
    // Aplicar taxa de fim de semana
    if (isWeekend && pricingRules.weekendSurcharge.active) {
      price = price * (1 + pricingRules.weekendSurcharge.surchargePercent / 100)
    }
    
    // Aplicar taxa de última hora
    if (pricingRules.lastMinute.active && new Date() > pricingRules.lastMinute.startDate) {
      price = price * (1 + pricingRules.lastMinute.surchargePercent / 100)
    }
    
    return price * quantity
  }

  // Função para aplicar código promocional
  const applyPromoCode = (code, subtotal, totalQuantity) => {
    const promo = promoCodes[code.toUpperCase()]
    
    if (!promo || !promo.active || promo.usageCount >= promo.usageLimit) {
      return { valid: false, message: 'Código promocional inválido ou expirado' }
    }
    
    if (promo.minQuantity && totalQuantity < promo.minQuantity) {
      return { 
        valid: false, 
        message: `Este código requer no mínimo ${promo.minQuantity} bilhetes` 
      }
    }
    
    let discount = 0
    if (promo.type === 'percentage') {
      discount = subtotal * (promo.value / 100)
    } else if (promo.type === 'fixed') {
      discount = Math.min(promo.value, subtotal)
    }
    
    return {
      valid: true,
      discount,
      description: promo.description,
      code: code.toUpperCase()
    }
  }

  // Função para calcular desconto por quantidade
  const calculateQuantityDiscount = (totalQuantity, subtotal) => {
    if (totalQuantity >= 10) {
      return { percent: 15, amount: subtotal * 0.15, description: 'Desconto para 10+ bilhetes' }
    } else if (totalQuantity >= 5) {
      return { percent: 10, amount: subtotal * 0.10, description: 'Desconto para 5+ bilhetes' }
    } else if (totalQuantity >= 3) {
      return { percent: 5, amount: subtotal * 0.05, description: 'Desconto para 3+ bilhetes' }
    }
    return { percent: 0, amount: 0, description: null }
  }

  const value = {
    ticketTypes,
    pricingRules,
    promoCodes,
    calculatePrice,
    applyPromoCode,
    calculateQuantityDiscount
  }

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  )
}

