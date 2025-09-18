import Header from './Header'
import Footer from './Footer'

const Layout = ({ children, cartItemsCount, onCartClick }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemsCount={cartItemsCount} onCartClick={onCartClick} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

