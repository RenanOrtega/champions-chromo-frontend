import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Truck, User, CheckCircle, Loader2 } from 'lucide-react';
import OrderSummary from '@/components/OrderSummary';

interface PersonalInfo {
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

interface DeliveryInfo {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface PaymentInfo {
  method: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export interface FormData {
  personalInfo: PersonalInfo;
  deliveryInfo: DeliveryInfo;
  paymentInfo: PaymentInfo;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { finalTotal } = useCart();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoadingCep, setIsLoadingCep] = useState<boolean>(false);
  const [cepError, setCepError] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: '',
      email: '',
      cpf: '',
      phone: ''
    },
    deliveryInfo: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    paymentInfo: {
      method: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: ''
    }
  });

  // Função para formatar CPF: XXX.XXX.XXX-XX
  const formatCpf = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  // Função para formatar telefone: (XX) XXXXX-XXXX
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits.length ? `(${digits}` : digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  // Função para formatar CEP: XXXXX-XXX
  const formatCep = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  };

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    // Aplicar formatação específica para alguns campos
    let formattedValue = value;

    if (section === 'personalInfo' && field === 'cpf') {
      formattedValue = formatCpf(value);
    } else if (section === 'personalInfo' && field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (section === 'deliveryInfo' && field === 'cep') {
      formattedValue = formatCep(value);
    }

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: formattedValue
      }
    }));
  };

  // Função para buscar dados de endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    setCepError('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setCepError('CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        deliveryInfo: {
          ...prev.deliveryInfo,
          street: data.logradouro,
          complement: data.complemento,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }
      }));
    } catch (error) {
      setCepError('Erro ao buscar o CEP');
      console.error('Erro ao buscar o CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  // Efeito para buscar o endereço quando o CEP for preenchido completamente
  useEffect(() => {
    const cep = formData.deliveryInfo.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      fetchAddressByCep(cep);
    }
  }, [formData.deliveryInfo.cep]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Verificar qual método de pagamento foi selecionado
    if (formData.paymentInfo.method === 'pix') {
      // Redirecionar para a página de PIX com os dados necessários
      navigate('/checkout/pix', {
        state: {
          formData: formData,
          totalAmount: finalTotal()
        }
      });
      return;
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/cart');
    }
  };

  // Renderização condicional dos formulários baseado no passo atual
  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="mr-2 h-5 w-5 text-primary-600" />
              Dados Pessoais
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.personalInfo.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('personalInfo', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.personalInfo.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      required
                      maxLength={14}
                      placeholder="000.000.000-00"
                      value={formData.personalInfo.cpf}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('personalInfo', 'cpf', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      maxLength={15}
                      placeholder="(00) 00000-0000"
                      value={formData.personalInfo.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 cursor-pointer"
                  >
                    Continuar para Entrega
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Truck className="mr-2 h-5 w-5 text-primary-600" />
              Dados de Entrega
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cep"
                      required
                      maxLength={9}
                      placeholder="00000-000"
                      value={formData.deliveryInfo.cep}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('deliveryInfo', 'cep', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${cepError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {isLoadingCep && (
                      <div className="absolute right-3 top-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                      </div>
                    )}
                  </div>
                  {cepError && <p className="text-red-500 text-xs mt-1">{cepError}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Rua
                    </label>
                    <input
                      type="text"
                      id="street"
                      required
                      value={formData.deliveryInfo.street}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('deliveryInfo', 'street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      readOnly={isLoadingCep}
                    />
                  </div>
                  <div>
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      id="number"
                      required
                      value={formData.deliveryInfo.number}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('deliveryInfo', 'number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complement"
                    value={formData.deliveryInfo.complement}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('deliveryInfo', 'complement', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly={isLoadingCep}
                  />
                </div>
                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    required
                    value={formData.deliveryInfo.neighborhood}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('deliveryInfo', 'neighborhood', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly={isLoadingCep}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="city"
                      required
                      value={formData.deliveryInfo.city}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('deliveryInfo', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      readOnly={isLoadingCep}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      id="state"
                      required
                      value={formData.deliveryInfo.state}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('deliveryInfo', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      readOnly={isLoadingCep}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 cursor-pointer"
                  >
                    Continuar para Pagamento
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      case 3:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary-600" />
              Meio de Pagamento
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione a forma de pagamento
                  </p>
                  <div className="space-y-2">
                    <div></div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pix"
                        checked={formData.paymentInfo.method === 'pix'}
                        onChange={() => handleInputChange('paymentInfo', 'method', 'pix')}
                        className="text-primary-600"
                      />
                      <span>PIX</span>
                    </label>
                  </div>
                </div>

                {formData.paymentInfo.method === 'creditCard' && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        required
                        value={formData.paymentInfo.cardName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('paymentInfo', 'cardName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        required
                        placeholder="0000 0000 0000 0000"
                        value={formData.paymentInfo.cardNumber}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, '');
                          const formattedValue = value
                            .replace(/(\d{4})(?=\d)/g, '$1 ')
                            .trim();
                          handleInputChange('paymentInfo', 'cardNumber', formattedValue);
                        }}
                        maxLength={19}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Validade
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          placeholder="MM/AA"
                          required
                          value={formData.paymentInfo.cardExpiry}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            // Formatar data de validade (MM/AA)
                            const value = e.target.value.replace(/\D/g, '');
                            let formattedValue = value;
                            if (value.length > 2) {
                              formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                            }
                            handleInputChange('paymentInfo', 'cardExpiry', formattedValue);
                          }}
                          maxLength={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cardCvv"
                          required
                          placeholder="000"
                          value={formData.paymentInfo.cardCvv}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            // Permitir apenas números para o CVV
                            const value = e.target.value.replace(/\D/g, '');
                            handleInputChange('paymentInfo', 'cardCvv', value);
                          }}
                          maxLength={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentInfo.method === 'pix' && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Clique no botão abaixo para gerar o QR Code para pagamento via PIX.
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!formData.paymentInfo.method}
                    className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {formData.paymentInfo.method === 'pix' ? (
                      "Gerar PIX"
                    ) : (
                      "Finalizar Pedido"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={goBack}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Indicador de progresso */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                  {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <p className="text-xs mt-1">Dados Pessoais</p>
              </div>
              <div className={`flex-grow h-1 ${currentStep > 1 ? 'bg-primary-600' : 'bg-gray-200'} mx-2`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                  {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                </div>
                <p className="text-xs mt-1">Entrega</p>
              </div>
              <div className={`flex-grow h-1 ${currentStep > 2 ? 'bg-primary-600' : 'bg-gray-200'} mx-2`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="text-xs mt-1">Pagamento</p>
              </div>
            </div>
          </div>

          {renderStepForm()}
        </div>
        <div className="lg:col-span-1">
          <OrderSummary
            showCouponInput={false}
            showFinishButton={false}
            className="lg:sticky lg:top-4"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;