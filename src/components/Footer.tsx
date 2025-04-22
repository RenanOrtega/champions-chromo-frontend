import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Álbuns de Figurinhas Schoolres. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link to="/termos" className="text-sm text-gray-600 hover:text-primary-600">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="text-sm text-gray-600 hover:text-primary-600">
              Política de Privacidade
            </Link>
            <Link to="/contato" className="text-sm text-gray-600 hover:text-primary-600">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer