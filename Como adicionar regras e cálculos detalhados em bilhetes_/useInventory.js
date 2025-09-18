import { useState, useCallback } from 'react'

/**
 * Hook para gerenciar inventário de bilhetes
 * Simula um sistema de controle de estoque em tempo real
 */
export const useInventory = (initialTicketTypes) => {
  const [inventory, setInventory] = useState(() => {
    // Inicializar inventário com base nos tipos de bilhetes
    const initialInventory = {}
    initialTicketTypes.forEach(ticket => {
      initialInventory[ticket.id] = {
        available: ticket.available,
        reserved: 0, // Bilhetes reservados temporariamente (no carrinho)
        sold: 0,
        total: ticket.available
      }
    })
    return initialInventory
  })

  // Reservar bilhetes temporariamente (quando adicionados ao carrinho)
  const reserveTickets = useCallback((ticketId, quantity) => {
    setInventory(prev => {
      const current = prev[ticketId]
      if (!current) return prev

      const newReserved = Math.min(quantity, current.available)
      
      return {
        ...prev,
        [ticketId]: {
          ...current,
          available: current.available - newReserved,
          reserved: current.reserved + newReserved
        }
      }
    })
    
    return inventory[ticketId]?.available >= quantity
  }, [inventory])

  // Liberar bilhetes reservados (quando removidos do carrinho)
  const releaseTickets = useCallback((ticketId, quantity) => {
    setInventory(prev => {
      const current = prev[ticketId]
      if (!current) return prev

      const toRelease = Math.min(quantity, current.reserved)
      
      return {
        ...prev,
        [ticketId]: {
          ...current,
          available: current.available + toRelease,
          reserved: current.reserved - toRelease
        }
      }
    })
  }, [])

  // Confirmar venda (converter reservados em vendidos)
  const confirmSale = useCallback((ticketId, quantity) => {
    setInventory(prev => {
      const current = prev[ticketId]
      if (!current) return prev

      const toConfirm = Math.min(quantity, current.reserved)
      
      return {
        ...prev,
        [ticketId]: {
          ...current,
          reserved: current.reserved - toConfirm,
          sold: current.sold + toConfirm
        }
      }
    })
  }, [])

  // Verificar disponibilidade
  const checkAvailability = useCallback((ticketId, quantity) => {
    const current = inventory[ticketId]
    if (!current) return false
    
    return current.available >= quantity
  }, [inventory])

  // Obter status do inventário
  const getInventoryStatus = useCallback((ticketId) => {
    const current = inventory[ticketId]
    if (!current) return null

    const totalAvailable = current.available
    const percentageAvailable = (totalAvailable / current.total) * 100

    let status = 'available'
    let urgency = 'low'

    if (totalAvailable === 0) {
      status = 'sold_out'
      urgency = 'critical'
    } else if (percentageAvailable <= 5) {
      status = 'critical_low'
      urgency = 'critical'
    } else if (percentageAvailable <= 15) {
      status = 'low'
      urgency = 'high'
    } else if (percentageAvailable <= 30) {
      status = 'medium'
      urgency = 'medium'
    }

    return {
      ...current,
      status,
      urgency,
      percentageAvailable: Math.round(percentageAvailable)
    }
  }, [inventory])

  // Obter estatísticas gerais
  const getOverallStats = useCallback(() => {
    const stats = {
      totalTickets: 0,
      totalAvailable: 0,
      totalReserved: 0,
      totalSold: 0,
      byType: {}
    }

    Object.entries(inventory).forEach(([ticketId, data]) => {
      stats.totalTickets += data.total
      stats.totalAvailable += data.available
      stats.totalReserved += data.reserved
      stats.totalSold += data.sold
      
      stats.byType[ticketId] = {
        ...data,
        salesRate: data.total > 0 ? (data.sold / data.total) * 100 : 0
      }
    })

    stats.overallSalesRate = stats.totalTickets > 0 ? (stats.totalSold / stats.totalTickets) * 100 : 0

    return stats
  }, [inventory])

  // Simular atualizações em tempo real (outras pessoas comprando)
  const simulateRealTimeUpdates = useCallback(() => {
    setInventory(prev => {
      const updated = { ...prev }
      
      // Simular vendas aleatórias ocasionais
      Object.keys(updated).forEach(ticketId => {
        if (Math.random() < 0.1 && updated[ticketId].available > 0) { // 10% chance
          const randomSale = Math.min(
            Math.floor(Math.random() * 3) + 1, // 1-3 bilhetes
            updated[ticketId].available
          )
          
          updated[ticketId] = {
            ...updated[ticketId],
            available: updated[ticketId].available - randomSale,
            sold: updated[ticketId].sold + randomSale
          }
        }
      })
      
      return updated
    })
  }, [])

  // Resetar inventário (para testes)
  const resetInventory = useCallback(() => {
    setInventory(prev => {
      const reset = {}
      Object.keys(prev).forEach(ticketId => {
        reset[ticketId] = {
          ...prev[ticketId],
          available: prev[ticketId].total,
          reserved: 0,
          sold: 0
        }
      })
      return reset
    })
  }, [])

  // Atualizar estoque total (adicionar mais bilhetes)
  const addStock = useCallback((ticketId, quantity) => {
    setInventory(prev => {
      const current = prev[ticketId]
      if (!current) return prev

      return {
        ...prev,
        [ticketId]: {
          ...current,
          available: current.available + quantity,
          total: current.total + quantity
        }
      }
    })
  }, [])

  return {
    inventory,
    reserveTickets,
    releaseTickets,
    confirmSale,
    checkAvailability,
    getInventoryStatus,
    getOverallStats,
    simulateRealTimeUpdates,
    resetInventory,
    addStock
  }
}

