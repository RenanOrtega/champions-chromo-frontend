import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itens } = useCart()

  const totalItems = itens.reduce((total, item) => {
    return total + item.stickers.reduce((sum, sticker) => sum + sticker.quantity, 0)
  }, 0)

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">ChampionsChromo</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600">
              Início
            </Link>
            <Link to="/schools" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600">
              Escolas
            </Link>
            <Link to="/cart" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 mr-1" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs rounded-full h-4 w-4">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
            </Link>
          </nav>

          <div className="flex items-center md:hidden">
            {/* Carrinho sempre visível com indicador */}
            <Link to="/cart" className="flex items-center p-2 mr-2 text-gray-700 hover:text-primary-600">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs rounded-full h-4 w-4">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Menu hambúrguer */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/schools"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Escolas
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar