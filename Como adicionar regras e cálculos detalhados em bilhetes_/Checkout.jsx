import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useTickets } from '../contexts/TicketContext'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Checkout = () => {
  const { 
    items, 
    calculateTotals, 
    getCartSummary, 
    clearCart 
  } = useCart()
  
  const { 
    calculatePrice, 
    calculateQuantityDiscount 
  } = useTickets()

  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    installments: 1
  })

  const [errors, setErrors] = useState({})

  const totals = calculateTotals(calculatePrice, calculateQuantityDiscount)
  const summary = getCartSummary()

  const validateForm = () => {
    const newErrors = {}

    // Validar informações do cliente
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'Nome é obrigatório'
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório'
    if (!customerInfo.email.trim()) newErrors.email = 'Email é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email inválido'
    if (!customerInfo.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    if (!customerInfo.cpf.trim()) newErrors.cpf = 'CPF é obrigatório'

    // Validar informações de pagamento
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Número do cartão é obrigatório'
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Data de validade é obrigatória'
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV é obrigatório'
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Nome no cartão é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (section, field, value) => {
    if (section === 'customer') {
      setCustomerInfo(prev => ({ ...prev, [field]: value }))
    } else if (section === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [field]: value }))
    }
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simular processamento de pagamento
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Gerar ID do pedido
      const newOrderId = 'ORD-' + Date.now().toString(36).toUpperCase()
      setOrderId(newOrderId)
      
      // Limpar carrinho
      clearCart()
      
      setOrderComplete(true)
    } catch (error) {
      console.error('Erro no processamento:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (summary.isEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Carrinho vazio</h1>
          <p className="text-muted-foreground mb-8">
            Adicione alguns bilhetes antes de finalizar a compra.
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

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Compra realizada com sucesso!
            </h1>
            <p className="text-green-600 mb-6">
              Seu pedido foi processado e você receberá os bilhetes por email.
            </p>
            <div className="bg-white border border-green-200 rounded p-4 mb-6">
              <p className="text-sm text-muted-foreground">Número do pedido:</p>
              <p className="text-lg font-mono font-bold">{orderId}</p>
            </div>
            <div className="space-y-2 text-sm text-green-600">
              <p>✓ Email de confirmação enviado</p>
              <p>✓ Bilhetes digitais anexados</p>
              <p>✓ Instruções de acesso incluídas</p>
            </div>
          </div>
          
          <div className="space-x-4">
            <Link to="/">
              <Button variant="outline">
                Comprar mais bilhetes
              </Button>
            </Link>
            <Button onClick={() => window.print()}>
              Imprimir comprovante
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <Link to="/cart">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao carrinho
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Informações pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome *</label>
                      <Input
                        value={customerInfo.firstName}
                        onChange={(e) => handleInputChange('customer', 'firstName', e.target.value)}
                        placeholder="Seu nome"
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sobrenome *</label>
                      <Input
                        value={customerInfo.lastName}
                        onChange={(e) => handleInputChange('customer', 'lastName', e.target.value)}
                        placeholder="Seu sobrenome"
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
                        placeholder="seu@email.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefone *</label>
                      <Input
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">CPF *</label>
                    <Input
                      value={customerInfo.cpf}
                      onChange={(e) => handleInputChange('customer', 'cpf', e.target.value)}
                      placeholder="000.000.000-00"
                      className={errors.cpf ? 'border-red-500' : ''}
                    />
                    {errors.cpf && (
                      <p className="text-sm text-red-500 mt-1">{errors.cpf}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Informações de pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Informações de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Número do Cartão *</label>
                    <Input
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handleInputChange('payment', 'cardNumber', formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength="19"
                      className={errors.cardNumber ? 'border-red-500' : ''}
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Validade *</label>
                      <Input
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handleInputChange('payment', 'expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/AA"
                        maxLength="5"
                        className={errors.expiryDate ? 'border-red-500' : ''}
                      />
                      {errors.expiryDate && (
                        <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">CVV *</label>
                      <Input
                        value={paymentInfo.cvv}
                        onChange={(e) => handleInputChange('payment', 'cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="000"
                        maxLength="4"
                        className={errors.cvv ? 'border-red-500' : ''}
                      />
                      {errors.cvv && (
                        <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Nome no Cartão *</label>
                    <Input
                      value={paymentInfo.cardName}
                      onChange={(e) => handleInputChange('payment', 'cardName', e.target.value.toUpperCase())}
                      placeholder="NOME COMO NO CARTÃO"
                      className={errors.cardName ? 'border-red-500' : ''}
                    />
                    {errors.cardName && (
                      <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Parcelamento</label>
                    <select
                      value={paymentInfo.installments}
                      onChange={(e) => handleInputChange('payment', 'installments', parseInt(e.target.value))}
                      className="w-full p-2 border border-input rounded-md"
                    >
                      <option value={1}>À vista - R$ {totals.total.toFixed(2)}</option>
                      <option value={2}>2x de R$ {(totals.total / 2).toFixed(2)}</option>
                      <option value={3}>3x de R$ {(totals.total / 3).toFixed(2)}</option>
                      <option value={6}>6x de R$ {(totals.total / 6).toFixed(2)}</option>
                      <option value={12}>12x de R$ {(totals.total / 12).toFixed(2)}</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Seus dados estão protegidos com criptografia SSL</span>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando pagamento...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Finalizar Compra - R$ {totals.total.toFixed(2)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Resumo do pedido */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Itens */}
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.ticketId} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.ticketType.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        R$ {calculatePrice(item.ticketType, item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totais */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {totals.subtotal.toFixed(2)}</span>
                  </div>

                  {totals.quantityDiscount.amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto por quantidade</span>
                      <span>-R$ {totals.quantityDiscount.amount.toFixed(2)}</span>
                    </div>
                  )}

                  {totals.promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
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

                {/* Informações de segurança */}
                <div className="bg-muted/50 rounded p-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1 mb-1">
                    <Shield className="h-3 w-3" />
                    <span className="font-medium">Compra 100% segura</span>
                  </div>
                  <p>Seus dados são protegidos e não são compartilhados com terceiros.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

