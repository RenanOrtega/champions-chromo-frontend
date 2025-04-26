const ThankYouScreen = ({ onBackToSchools }: { onBackToSchools: () => void }) => {
  return (
    <div className="text-center py-8">
      <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Obrigado pela sua compra!</h2>
      <p className="text-gray-600 mb-6">Seu pagamento foi confirmado com sucesso.</p>
      <button
        onClick={onBackToSchools}
        className="bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors cursor-pointer"
      >
        Continuar Comprando
      </button>
    </div>
  );
};

export default ThankYouScreen