import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Minus,
  ShoppingCart,
  Info
} from 'lucide-react'
import { useTickets } from '../../contexts/TicketContext'

const TicketCard = ({ ticket, onAddToCart }) => {
  const { calculatePrice, pricingRules } = useTickets()
  const [quantity, setQuantity] = useState(1)
  const [showDetails, setShowDetails] = useState(false)

  const basePrice = calculatePrice(ticket, 1)
  const totalPrice = calculatePrice(ticket, quantity)
  const originalPrice = ticket.basePrice
  const hasDiscount = basePrice < originalPrice

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= ticket.maxPerPurchase) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(quantity)
    setQuantity(1) // Reset quantity after adding
  }

  const getAvailabilityStatus = () => {
    if (ticket.available === 0) {
      return { status: 'sold-out', text: 'Esgotado', color: 'destructive' }
    } else if (ticket.available <= 10) {
      return { status: 'low-stock', text: `Apenas ${ticket.available} restantes`, color: 'destructive' }
    } else if (ticket.available <= 50) {
      return { status: 'medium-stock', text: `${ticket.available} disponíveis`, color: 'secondary' }
    } else {
      return { status: 'in-stock', text: `${ticket.available} disponíveis`, color: 'secondary' }
    }
  }

  const availability = getAvailabilityStatus()

  const getCategoryIcon = () => {
    switch (ticket.category) {
      case 'premium':
        return <Star className="h-4 w-4" />
      case 'discount':
        return <AlertCircle className="h-4 w-4" />
      case 'special':
        return <Users className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = () => {
    switch (ticket.category) {
      case 'premium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'discount':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'special':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${
      ticket.available === 0 ? 'opacity-60' : ''
    }`}>
      {/* Badge de categoria */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`${getCategoryColor()} flex items-center space-x-1`}>
          {getCategoryIcon()}
          <span className="capitalize">{ticket.category}</span>
        </Badge>
      </div>

      <CardHeader className="pb-4">
        <CardTitle className="text-xl pr-20">{ticket.name}</CardTitle>
        <p className="text-muted-foreground text-sm">{ticket.description}</p>
        
        {/* Informações especiais */}
        {ticket.ageRange && (
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Idade: {ticket.ageRange}</span>
          </div>
        )}
        
        {ticket.requiresValidation && (
          <div className="flex items-center space-x-1 text-sm text-orange-600">
            <AlertCircle className="h-4 w-4" />
            <span>Requer comprovação</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preço */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-primary">
              R$ {basePrice.toFixed(2)}
            </span>
          </div>
          
          {hasDiscount && (
            <div className="text-sm text-green-600 font-medium">
              {ticket.discountPercent && `${ticket.discountPercent}% de desconto`}
              {pricingRules.earlyBird.active && ` + ${pricingRules.earlyBird.discountPercent}% early bird`}
            </div>
          )}
        </div>

        {/* Disponibilidade */}
        <Badge variant={availability.color === 'destructive' ? 'destructive' : 'secondary'}>
          {availability.text}
        </Badge>

        {/* Features principais */}
        <div className="space-y-2">
          {ticket.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
          
          {ticket.features.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="p-0 h-auto text-primary hover:text-primary/80"
            >
              <Info className="h-4 w-4 mr-1" />
              {showDetails ? 'Ver menos' : `Ver mais ${ticket.features.length - 3} benefícios`}
            </Button>
          )}
        </div>

        {/* Features expandidas */}
        {showDetails && ticket.features.length > 3 && (
          <div className="space-y-2 pt-2 border-t">
            {ticket.features.slice(3).map((feature, index) => (
              <div key={index + 3} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {/* Controles de quantidade */}
        {ticket.available > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantidade:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center"
                  min="1"
                  max={ticket.maxPerPurchase}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= ticket.maxPerPurchase}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Máximo {ticket.maxPerPurchase} por compra
            </div>

            {quantity > 1 && (
              <div className="bg-muted/50 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total ({quantity} bilhetes):</span>
                  <span className="text-lg font-bold text-primary">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
                {quantity >= 3 && (
                  <div className="text-xs text-green-600 mt-1">
                    Você pode ter desconto adicional por quantidade no carrinho!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={ticket.available === 0}
          size="lg"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {ticket.available === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TicketCard

