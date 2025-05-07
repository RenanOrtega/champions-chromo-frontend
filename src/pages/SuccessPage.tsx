import { useNavigate } from 'react-router-dom';
import WhatsAppIcon from '../assets/whatsapp.svg'
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToSchools = () => {
    navigate("/")
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg animate-fade-in">
        <div className="bg-gradient-to-r from-primary-100 to-primary-50 p-6 flex flex-col items-center">
          <div className="rounded-full bg-white p-2 shadow-md mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Obrigado pela sua compra!</h2>
          <p className="text-gray-600 text-center">
            Seu pagamento foi confirmado com sucesso.
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6 space-y-4">
            <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
              <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                <span className="flex h-6 w-6 rounded-full bg-amber-200 mr-2 items-center justify-center">
                  <span className="text-amber-700 text-xs">!</span>
                </span>
                Informação importante
              </h3>
              <p className="text-amber-700 text-sm">
                No momento não disponibilizamos rastreamento de entrega no site.
                Para informações sobre o status do seu pedido, entre em contato conosco pelo WhatsApp.
              </p>
            </div>
            
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow"
            >
              <img src={WhatsAppIcon} alt="Icone whatsapp" className='w-5 h-5 mr-2' />
              <span>Falar pelo WhatsApp</span>
            </a>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button 
              onClick={handleBackToSchools}
              className="w-full flex items-center justify-center cursor-pointer rounded border-2 border-primary-300 p-2 text-primary-300 hover:text-white hover:bg-primary-300 transition-all duration-300"
            >
              <span>Continuar Comprando</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;