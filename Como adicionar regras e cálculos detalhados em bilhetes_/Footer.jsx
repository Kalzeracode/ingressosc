import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informações da empresa */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Sistema de Bilhetes
            </h3>
            <p className="text-sm mb-4">
              Sua plataforma confiável para compra de ingressos para os melhores eventos.
              Segurança, praticidade e os melhores preços em um só lugar.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Feito com amor</span>
              </div>
            </div>
          </div>
          
          {/* Links úteis */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Links Úteis
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#termos" className="hover:text-foreground transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#privacidade" className="hover:text-foreground transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#suporte" className="hover:text-foreground transition-colors">
                  Suporte
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Contato
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@sistemabilhetes.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-4 text-center text-sm">
          <p>&copy; 2024 Sistema de Bilhetes. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

