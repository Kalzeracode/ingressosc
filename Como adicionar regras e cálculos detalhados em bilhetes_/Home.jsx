import { useState } from 'react'
import { useTickets } from '../contexts/TicketContext'
import { useCart } from '../contexts/CartContext'
import TicketCard from '../components/tickets/TicketCard'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'

const Home = () => {
  const { ticketTypes, pricingRules } = useTickets()
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todos', count: ticketTypes.length },
    { id: 'standard', name: 'Padrão', count: ticketTypes.filter(t => t.category === 'standard').length },
    { id: 'premium', name: 'Premium', count: ticketTypes.filter(t => t.category === 'premium').length },
    { id: 'discount', name: 'Desconto', count: ticketTypes.filter(t => t.category === 'discount').length },
    { id: 'special', name: 'Especial', count: ticketTypes.filter(t => t.category === 'special').length }
  ]

  const filteredTickets = selectedCategory === 'all' 
    ? ticketTypes 
    : ticketTypes.filter(ticket => ticket.category === selectedCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Conferência Tech 2024
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          O maior evento de tecnologia do Brasil. Palestras inspiradoras, networking 
          e as últimas tendências em inovação tecnológica.
        </p>
        
        {/* Informações do evento */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span>15-17 Jan 2025</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span>São Paulo, SP</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>3 dias</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>5000+ participantes</span>
          </div>
        </div>

        {/* Promoções ativas */}
        {pricingRules.earlyBird.active && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
            <Badge variant="secondary" className="mb-2">
              🎉 Promoção Ativa
            </Badge>
            <p className="text-sm text-foreground">
              <strong>{pricingRules.earlyBird.discountPercent}% de desconto</strong> em todos os bilhetes!
              <br />
              <span className="text-muted-foreground">
                Válido até {pricingRules.earlyBird.endDate.toLocaleDateString('pt-BR')}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Filtros de categoria */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Escolha seu bilhete</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="relative"
            >
              {category.name}
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs"
              >
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de bilhetes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onAddToCart={(quantity) => addItem(ticket, quantity)}
          />
        ))}
      </div>

      {/* Informações adicionais */}
      <div className="mt-16 bg-muted/50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-8">Por que participar?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Networking</h4>
            <p className="text-muted-foreground">
              Conecte-se com profissionais e empresas líderes do mercado tech.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Conteúdo Exclusivo</h4>
            <p className="text-muted-foreground">
              Palestras e workshops com especialistas renomados mundialmente.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Experiência Completa</h4>
            <p className="text-muted-foreground">
              3 dias intensivos de aprendizado, inovação e inspiração.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

