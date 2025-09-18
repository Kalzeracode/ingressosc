/**
 * Utilitários para cálculos de preços e descontos do sistema de bilhetes
 */

/**
 * Calcula o preço final de um bilhete considerando todas as regras
 * @param {Object} ticketType - Tipo de bilhete
 * @param {number} quantity - Quantidade de bilhetes
 * @param {Object} pricingRules - Regras de preço ativas
 * @param {boolean} isWeekend - Se a compra é para fim de semana
 * @returns {Object} Detalhes do cálculo de preço
 */
export const calculateDetailedPrice = (ticketType, quantity = 1, pricingRules = {}, isWeekend = false) => {
  const calculations = {
    basePrice: ticketType.basePrice,
    quantity,
    subtotal: ticketType.basePrice * quantity,
    discounts: [],
    surcharges: [],
    finalPrice: 0
  }

  let currentPrice = ticketType.basePrice

  // 1. Desconto do tipo de bilhete (estudante, idoso, etc.)
  if (ticketType.discountPercent) {
    const discount = {
      type: 'ticket_discount',
      name: `Desconto ${ticketType.name}`,
      percent: ticketType.discountPercent,
      amount: currentPrice * (ticketType.discountPercent / 100)
    }
    calculations.discounts.push(discount)
    currentPrice -= discount.amount
  }

  // 2. Desconto Early Bird
  if (pricingRules.earlyBird?.active && new Date() < pricingRules.earlyBird.endDate) {
    const discount = {
      type: 'early_bird',
      name: pricingRules.earlyBird.description,
      percent: pricingRules.earlyBird.discountPercent,
      amount: currentPrice * (pricingRules.earlyBird.discountPercent / 100)
    }
    calculations.discounts.push(discount)
    currentPrice -= discount.amount
  }

  // 3. Taxa de fim de semana
  if (isWeekend && pricingRules.weekendSurcharge?.active) {
    const surcharge = {
      type: 'weekend_surcharge',
      name: pricingRules.weekendSurcharge.description,
      percent: pricingRules.weekendSurcharge.surchargePercent,
      amount: currentPrice * (pricingRules.weekendSurcharge.surchargePercent / 100)
    }
    calculations.surcharges.push(surcharge)
    currentPrice += surcharge.amount
  }

  // 4. Taxa de última hora
  if (pricingRules.lastMinute?.active && new Date() > pricingRules.lastMinute.startDate) {
    const surcharge = {
      type: 'last_minute',
      name: pricingRules.lastMinute.description,
      percent: pricingRules.lastMinute.surchargePercent,
      amount: currentPrice * (pricingRules.lastMinute.surchargePercent / 100)
    }
    calculations.surcharges.push(surcharge)
    currentPrice += surcharge.amount
  }

  calculations.finalPrice = Math.max(0, currentPrice * quantity)
  calculations.unitPrice = Math.max(0, currentPrice)
  calculations.totalDiscountAmount = calculations.discounts.reduce((sum, d) => sum + d.amount, 0) * quantity
  calculations.totalSurchargeAmount = calculations.surcharges.reduce((sum, s) => sum + s.amount, 0) * quantity
  calculations.savings = (calculations.basePrice - calculations.unitPrice) * quantity

  return calculations
}

/**
 * Calcula descontos por quantidade
 * @param {number} totalQuantity - Quantidade total de bilhetes
 * @param {number} subtotal - Subtotal antes do desconto
 * @returns {Object} Informações do desconto por quantidade
 */
export const calculateQuantityDiscount = (totalQuantity, subtotal) => {
  const discountTiers = [
    { minQuantity: 10, percent: 15, name: 'Desconto para grupos grandes (10+)' },
    { minQuantity: 5, percent: 10, name: 'Desconto para grupos médios (5-9)' },
    { minQuantity: 3, percent: 5, name: 'Desconto para grupos pequenos (3-4)' }
  ]

  for (const tier of discountTiers) {
    if (totalQuantity >= tier.minQuantity) {
      return {
        applicable: true,
        percent: tier.percent,
        amount: subtotal * (tier.percent / 100),
        description: tier.name,
        minQuantity: tier.minQuantity
      }
    }
  }

  return {
    applicable: false,
    percent: 0,
    amount: 0,
    description: null,
    minQuantity: 0
  }
}

/**
 * Valida e aplica código promocional
 * @param {string} code - Código promocional
 * @param {Object} promoCodes - Códigos disponíveis
 * @param {number} subtotal - Subtotal da compra
 * @param {number} totalQuantity - Quantidade total de bilhetes
 * @returns {Object} Resultado da validação e aplicação
 */
export const validateAndApplyPromoCode = (code, promoCodes, subtotal, totalQuantity) => {
  const upperCode = code.toUpperCase()
  const promo = promoCodes[upperCode]

  if (!promo) {
    return {
      valid: false,
      error: 'INVALID_CODE',
      message: 'Código promocional não encontrado'
    }
  }

  if (!promo.active) {
    return {
      valid: false,
      error: 'INACTIVE_CODE',
      message: 'Código promocional inativo'
    }
  }

  if (promo.usageCount >= promo.usageLimit) {
    return {
      valid: false,
      error: 'USAGE_LIMIT_EXCEEDED',
      message: 'Código promocional esgotado'
    }
  }

  if (promo.minQuantity && totalQuantity < promo.minQuantity) {
    return {
      valid: false,
      error: 'MIN_QUANTITY_NOT_MET',
      message: `Este código requer no mínimo ${promo.minQuantity} bilhetes`
    }
  }

  if (promo.minAmount && subtotal < promo.minAmount) {
    return {
      valid: false,
      error: 'MIN_AMOUNT_NOT_MET',
      message: `Este código requer compra mínima de R$ ${promo.minAmount.toFixed(2)}`
    }
  }

  let discountAmount = 0
  if (promo.type === 'percentage') {
    discountAmount = subtotal * (promo.value / 100)
  } else if (promo.type === 'fixed') {
    discountAmount = Math.min(promo.value, subtotal)
  }

  // Aplicar limite máximo de desconto se existir
  if (promo.maxDiscount) {
    discountAmount = Math.min(discountAmount, promo.maxDiscount)
  }

  return {
    valid: true,
    code: upperCode,
    type: promo.type,
    value: promo.value,
    discount: discountAmount,
    description: promo.description,
    appliedAt: new Date()
  }
}

/**
 * Calcula o total final do carrinho com todos os descontos e taxas
 * @param {Array} cartItems - Itens do carrinho
 * @param {Object} pricingRules - Regras de preço
 * @param {Object} promoCode - Código promocional aplicado
 * @param {boolean} isWeekend - Se é fim de semana
 * @returns {Object} Cálculo completo do carrinho
 */
export const calculateCartTotal = (cartItems, pricingRules, promoCode = null, isWeekend = false) => {
  const calculation = {
    items: [],
    subtotal: 0,
    totalQuantity: 0,
    quantityDiscount: { applicable: false, amount: 0 },
    promoDiscount: { applicable: false, amount: 0 },
    totalDiscounts: 0,
    finalTotal: 0,
    breakdown: {
      baseAmount: 0,
      discountAmount: 0,
      surchargeAmount: 0
    }
  }

  // Calcular cada item
  cartItems.forEach(item => {
    const itemCalc = calculateDetailedPrice(
      item.ticketType, 
      item.quantity, 
      pricingRules, 
      isWeekend
    )
    
    calculation.items.push({
      ...item,
      calculation: itemCalc
    })
    
    calculation.subtotal += itemCalc.finalPrice
    calculation.totalQuantity += item.quantity
    calculation.breakdown.baseAmount += itemCalc.subtotal
    calculation.breakdown.discountAmount += itemCalc.totalDiscountAmount
    calculation.breakdown.surchargeAmount += itemCalc.totalSurchargeAmount
  })

  // Desconto por quantidade (aplicado sobre o subtotal)
  calculation.quantityDiscount = calculateQuantityDiscount(
    calculation.totalQuantity, 
    calculation.subtotal
  )

  // Desconto do código promocional (aplicado após desconto por quantidade)
  if (promoCode && promoCode.valid) {
    const subtotalAfterQuantityDiscount = calculation.subtotal - calculation.quantityDiscount.amount
    
    let promoDiscountAmount = 0
    if (promoCode.type === 'percentage') {
      promoDiscountAmount = subtotalAfterQuantityDiscount * (promoCode.value / 100)
    } else if (promoCode.type === 'fixed') {
      promoDiscountAmount = Math.min(promoCode.value, subtotalAfterQuantityDiscount)
    }

    calculation.promoDiscount = {
      applicable: true,
      amount: promoDiscountAmount,
      code: promoCode.code,
      description: promoCode.description
    }
  }

  // Total de descontos
  calculation.totalDiscounts = calculation.quantityDiscount.amount + calculation.promoDiscount.amount

  // Total final
  calculation.finalTotal = Math.max(0, calculation.subtotal - calculation.totalDiscounts)

  return calculation
}

/**
 * Formata valor monetário para exibição
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Moeda (padrão: BRL)
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value)
}

/**
 * Calcula estatísticas de vendas (para relatórios)
 * @param {Array} sales - Array de vendas
 * @returns {Object} Estatísticas calculadas
 */
export const calculateSalesStatistics = (sales) => {
  const stats = {
    totalSales: sales.length,
    totalRevenue: 0,
    totalTickets: 0,
    averageOrderValue: 0,
    ticketTypeBreakdown: {},
    discountUsage: {
      quantity: 0,
      promo: 0,
      total: 0
    }
  }

  sales.forEach(sale => {
    stats.totalRevenue += sale.total
    stats.totalTickets += sale.totalQuantity
    
    // Breakdown por tipo de bilhete
    sale.items.forEach(item => {
      const typeId = item.ticketType.id
      if (!stats.ticketTypeBreakdown[typeId]) {
        stats.ticketTypeBreakdown[typeId] = {
          name: item.ticketType.name,
          quantity: 0,
          revenue: 0
        }
      }
      stats.ticketTypeBreakdown[typeId].quantity += item.quantity
      stats.ticketTypeBreakdown[typeId].revenue += item.calculation.finalPrice
    })

    // Uso de descontos
    if (sale.quantityDiscount.applicable) {
      stats.discountUsage.quantity += sale.quantityDiscount.amount
    }
    if (sale.promoDiscount.applicable) {
      stats.discountUsage.promo += sale.promoDiscount.amount
    }
  })

  stats.averageOrderValue = stats.totalSales > 0 ? stats.totalRevenue / stats.totalSales : 0
  stats.discountUsage.total = stats.discountUsage.quantity + stats.discountUsage.promo

  return stats
}

