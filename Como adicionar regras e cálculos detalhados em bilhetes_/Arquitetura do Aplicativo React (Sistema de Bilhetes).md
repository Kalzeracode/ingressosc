
# Arquitetura do Aplicativo React (Sistema de Bilhetes)

## 1. Estrutura de Pastas

```
ticket-system/
├── public/
├── src/
│   ├── assets/             # Imagens, ícones, etc.
│   ├── components/         # Componentes reutilizáveis
│   │   ├── common/         # Componentes genéricos (Botão, Input, Modal)
│   │   ├── tickets/        # Componentes específicos de bilhetes (TicketCard, TicketList)
│   │   ├── cart/           # Componentes do carrinho (CartItem, CartSummary)
│   │   └── layout/         # Componentes de layout (Header, Footer, Navbar)
│   ├── contexts/           # Context API para gerenciamento de estado global
│   ├── hooks/              # Hooks personalizados
│   ├── pages/              # Páginas principais da aplicação (Home, Cart, Checkout)
│   ├── services/           # Lógica de comunicação com APIs (simulada)
│   ├── utils/              # Funções utilitárias (formatação, cálculos)
│   ├── App.jsx             # Componente principal da aplicação
│   ├── main.jsx            # Ponto de entrada da aplicação
│   └── index.css           # Estilos globais
├── package.json
├── vite.config.js
└── ...
```

## 2. Gerenciamento de Estado

Será utilizada a **React Context API** para gerenciar o estado global da aplicação, como:

*   **`TicketContext`**: Para armazenar os tipos de bilhetes disponíveis, preços e regras.
*   **`CartContext`**: Para gerenciar os itens adicionados ao carrinho, quantidades e cálculos de subtotal/total.
*   **`AuthContext` (simulado)**: Para gerenciar o estado de autenticação do usuário (se necessário para descontos específicos).

## 3. Roteamento

Será utilizado o **React Router DOM** para gerenciar as rotas da aplicação, permitindo navegação entre as páginas:

*   `/`: Página inicial (seleção de bilhetes)
*   `/cart`: Página do carrinho de compras
*   `/checkout`: Página de finalização da compra
*   `/confirmation`: Página de confirmação do pedido

## 4. Estilização

Será utilizado **Tailwind CSS** para estilização, conforme o template `manus-create-react-app`, garantindo um design responsivo e moderno.

## 5. Lógica de Negócio

A lógica de cálculo de preços, aplicação de descontos e validação de regras será implementada em funções utilitárias (`src/utils/`) e integrada aos contextos de estado.

## 6. Testes

Serão utilizados **Jest** e **React Testing Library** para garantir a qualidade e o funcionamento correto dos componentes e da lógica de negócio.

