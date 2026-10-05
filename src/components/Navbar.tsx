import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex h-16 items-center border-b-2 px-1 text-sm font-medium transition-colors ${isActive
    ? 'border-secondary-400 text-slate-900'
    : 'border-transparent text-slate-600 hover:text-slate-900'
  }`

const Navbar = () => {
  const { itens } = useCart()

  const totalItems = itens?.reduce((total, item) => {
    return total + item.stickers.reduce((sum, sticker) => sum + sticker.quantity, 0)
  }, 0) || 0

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="h-11 w-auto" />
          <span className="hidden text-base font-bold tracking-tight text-slate-900 sm:block">
            Rei das Figurinhas
          </span>
          <span className="sr-only sm:hidden">Rei das Figurinhas</span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-6">
          <NavLink to="/" end className={(state) => `${navLinkClass(state)} hidden sm:flex`}>
            Início
          </NavLink>
          <NavLink to="/schools" className={navLinkClass}>
            Escolas
          </NavLink>
          <NavLink
            to="/cart"
            aria-label={totalItems > 0 ? `Carrinho, ${totalItems} figurinhas` : 'Carrinho'}
            className={navLinkClass}
          >
            <span className="flex items-center gap-3">
              <span className="relative">
                <ShoppingCart className="size-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-2.5 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-tertiary px-1 text-[11px] font-semibold leading-none text-white tabular-nums">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">Carrinho</span>
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
