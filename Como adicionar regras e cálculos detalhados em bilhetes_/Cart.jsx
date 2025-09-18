import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useTickets } from '../contexts/TicketContext'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Cart = () => {
  const { 
    items, 
    promoCode, 
    updateQuantity, 
    removeItem, 
    applyPromoCode, 
    removePromoCode,
    calculateTotals,
    getCartSummary,
    validateCart
  } = useCart()
  
  const { 
    ticketTypes, 
    calculatePrice, 
    calculateQuantityDiscount, 
    applyPromoCode: validatePromoCode 
  } = useTickets()

  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [promoError, setPromoError] = useState('')

  const totals = calculateTotals(calculatePrice, calculateQuantityDiscount)
  const summary = getCartSummary()
  const validation = validateCart(ticketTypes)

  const handleQuantityChange = (ticketId, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(ticketId, newQuantity)
    }
  }

  const handleApplyPromoCode = () => {
    if (!promoCodeInput.trim()) {
      setPromoError('Digite um código promocional')
      return
    }

    const result = validatePromoCode(promoCodeInput, totals.subtotal, totals.totalQuantity)
    
    if (result.valid) {
      applyPromoCode(result)
      setPromoError('')
      setPromoCodeInput('')
    } else {
      setPromoError(result.message)
    }
  }

  const handleRemovePromoCode = () => {
    removePromoCode()
    setPromoError('')
  }

  if (summary.isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-8">
            Adicione alguns bilhetes para começar sua jornada na Conferência Tech 2024!
          </p>
          <Link to="/">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos bilhetes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar comprando
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de itens */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const price = calculatePrice(item.ticketType, item.quantity)
              const unitPrice = calculatePrice(item.ticketType, 1)
              
              return (
                <div key={item.ticketId} className="bg-card border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.ticketType.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {item.ticketType.description}
                      </p>
                      
                      {/* Características do bilhete */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.ticketType.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {item.ticketType.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.ticketType.features.length - 3} mais
                          </Badge>
                        )}
                      </div>

                      {/* Preço unitário */}
                      <div className="text-sm text-muted-foreground">
                        Preço unitário: R$ {unitPrice.toFixed(2)}
                      </div>
                    </div>

                    {/* Controles de quantidade e preço */}
                    <div className="text-right">
                      <div className="text-lg font-bold mb-4">
                        R$ {price.toFixed(2)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.ticketId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.ticketId, item.quantity + 1)}
                          disabled={item.quantity >= item.ticketType.maxPerPurchase}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(item.ticketId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Avisos */}
                  {item.quantity >= item.ticketType.maxPerPurchase && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      Limite máximo de {item.ticketType.maxPerPurchase} bilhetes por compra atingido.
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Resumo do pedido */}
          <div className="space-y-6">
            {/* Código promocional */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Código Promocional
              </h3>
              
              {promoCode ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <div>
                      <div className="font-medium text-green-800">{promoCode.code}</div>
                      <div className="text-sm text-green-600">{promoCode.description}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePromoCode}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite o código"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                    />
                    <Button onClick={handleApplyPromoCode}>
                      Aplicar
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-sm text-destructive">{promoError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Resumo de valores */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({totals.totalQuantity} bilhetes)</span>
                  <span>R$ {totals.subtotal.toFixed(2)}</span>
                </div>

                {totals.quantityDiscount.amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{totals.quantityDiscount.description}</span>
                    <span>-R$ {totals.quantityDiscount.amount.toFixed(2)}</span>
                  </div>
                )}

                {totals.promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Código promocional</span>
                    <span>-R$ {totals.promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {totals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Validação */}
              {!validation.isValid && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <h4 className="font-medium text-red-800 mb-2">Atenção:</h4>
                  <ul className="text-sm text-red-600 space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Link to="/checkout">
                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  disabled={!validation.isValid}
                >
                  Finalizar Compra
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

