import { ShoppingCart, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

const Header = ({ cartItemsCount = 0, onCartClick }) => {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e título */}
          <div className="flex items-center space-x-2">
            <Ticket className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Sistema de Bilhetes</h1>
          </div>
          
          {/* Navegação */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#eventos" className="hover:text-accent transition-colors">
              Eventos
            </a>
            <a href="#sobre" className="hover:text-accent transition-colors">
              Sobre
            </a>
            <a href="#contato" className="hover:text-accent transition-colors">
              Contato
            </a>
          </nav>
          
          {/* Carrinho */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCartClick}
            className="relative bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Carrinho
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header

