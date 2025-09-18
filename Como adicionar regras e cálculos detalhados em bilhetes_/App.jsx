import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { TicketProvider } from './contexts/TicketContext'
import { CartProvider, useCart } from './contexts/CartContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import './App.css'

function AppContent() {
  const { getCartSummary } = useCart()
  const navigate = useNavigate()
  const cartSummary = getCartSummary()

  const handleCartClick = () => {
    navigate('/cart')
  }

  return (
    <Layout 
      cartItemsCount={cartSummary.totalItems} 
      onCartClick={handleCartClick}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <TicketProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </TicketProvider>
  )
}

export default App

