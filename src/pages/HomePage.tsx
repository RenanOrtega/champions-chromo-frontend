import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="flex flex-col space-y-10 py-4">
      <section className="bg-primary rounded-lg p-6 md:p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-2" 
             style={{ backgroundImage: "url('/logo.png')" }}></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Álbuns de Figurinhas Personalizados para sua Escola
          </h1>
          <p className="text-lg mb-6">
            Eternize as memórias escolares dos seus filhos com nossos álbuns de figurinhas personalizados.
          </p>
          <Link
            to="/schools"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-xs bg-secondary-400 text-white hover:bg-secondary-500 transition-colors"
          >
            Começar agora
          </Link>
        </div>
      </section>

      <section className="py-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-primary-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Selecione a escola</h3>
            <p className="text-gray-600 text-center">
              Escolha a escola do seu filho para ver os álbuns disponíveis.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Escolha o Álbum</h3>
            <p className="text-gray-600 text-center">
              Selecione entre os modelos disponíveis para a escola.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Personalize e Compre</h3>
            <p className="text-gray-600 text-center">
              Selecione as figurinhas que deseja incluir e finalize o pagamento.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Lembranças que duram para sempre</h2>
            <p className="text-gray-700 mb-4">
              Nossos álbuns de figurinhas escolares são a maneira perfeita de preservar as memórias dos anos escolares do seu filho.
            </p>
            <p className="text-gray-700">
              Com fotos de alta qualidade e design personalizado para cada escola, estes álbuns se tornarão tesouros de família.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img 
              src="/logo.png" 
              alt="Rei das Figurinhas" 
              className="max-w-[200px] md:max-w-[250px] h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage