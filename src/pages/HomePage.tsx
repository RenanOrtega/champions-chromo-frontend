import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="flex flex-col space-y-10 py-4 mt-10">
      <section className="bg-linear-to-r from-primary-500 to-primary-700 rounded-lg p-6 md:p-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Álbuns de Figurinhas Personalizados para sua Escola
        </h1>
        <p className="text-lg mb-6">
          Eternize as memórias escolares dos seus filhos com nossos álbuns de figurinhas personalizados.
        </p>
        <Link
          to="/schools"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-xs bg-white text-primary-600 hover:bg-gray-100"
        >
          Começar agora
        </Link>
      </section>

      <section className="py-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-primary-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Selecione a escola</h3>
            <p className="text-gray-600 text-center">
              Escolha a escola do seu filho para ver os álbuns disponíveis.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Escolha o Álbum</h3>
            <p className="text-gray-600 text-center">
              Selecione entre os modelos disponíveis para a escola.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary-100 rounded-full p-4 mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalize e Compre</h3>
            <p className="text-gray-600 text-center">
              Selecione as figurinhas que deseja incluir e finalize o pagamento.
            </p>
          </div>
        </div>
      </section>

      {/* <section className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Escolas em Destaque</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((id) => (
                        <Link key={id} to={`/schools/${id}`} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-40 bg-gray-300 rounded-t-lg"></div>
                            <div className="p-4">
                                <h3 className="font-semibold">School Exemplo {id}</h3>
                                <p className="text-gray-600 text-sm">São Paulo, SP</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section> */}
    </div>
  )
}

export default HomePage