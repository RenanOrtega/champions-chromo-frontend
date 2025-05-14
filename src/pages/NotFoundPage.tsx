import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-red-500 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
                <p className="text-gray-600 mb-8">
                    A página que você está procurando não existe ou foi movida.
                </p>
                <Link
                    to="/"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                    Voltar para a página inicial
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage;