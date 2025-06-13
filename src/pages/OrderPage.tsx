import { createOrder } from "@/clients/order";
import OrderSummary from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Loader2, Truck } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

interface AddressInfo {
    postalCode: string;
    street: string;
    number: string;
    neighborhood: string;
    complement: string;
    city: string;
    state: string;
    name: string;
    email: string;
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

interface FormData {
    addressInfo: AddressInfo;
}

interface ValidationErrors {
    name?: string;
    email?: string;
}

const OrderPage = () => {
    const { itens, clearCart, finalTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState<string>('');
    const [isLoadingCep, setIsLoadingCep] = useState<boolean>(false);
    const [cepError, setCepError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState<FormData>({
        addressInfo: {
            postalCode: '',
            street: '',
            number: '',
            neighborhood: '',
            complement: '',
            city: '',
            state: '',
            name: '',
            email: ''
        },
    });

    const WHATSAPP_NUMBER = "5511973719123";

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};

        // Validação do nome
        if (!formData.addressInfo.name.trim()) {
            errors.name = 'Nome é obrigatório';
        }

        // Validação do email
        if (!formData.addressInfo.email.trim()) {
            errors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.addressInfo.email)) {
            errors.email = 'Email deve ter um formato válido';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateOrder = async () => {
        // Validar formulário antes de prosseguir
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const orderSummaryRequest = {
                albums: itens.map(item => ({
                    albumId: item.album.id,
                    schoolId: item.album.schoolId,
                    stickers: item.stickers.map(sticker => ({
                        type: sticker.type,
                        number: sticker.number,
                        quantity: sticker.quantity
                    }))
                })),
                customer: {
                    name: formData.addressInfo.name,
                    email: formData.addressInfo.email,
                    address: formData.addressInfo
                },
                priceTotal: finalTotal()
            };

            const response = await createOrder(orderSummaryRequest);

            // Assumindo que a resposta contém o ID do pedido
            setOrderId(response.id); // Fallback para timestamp se não houver ID
            setOrderCreated(true);
            clearCart(); // limpa o carrinho após o pedido
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppContact = () => {
        const message = `Olá, meu nome é ${formData.addressInfo.name}%0A%0AGostaria de finalizar o pagamento e envio do meu pedido.%0A%0APedido ID: ${orderId}%0A%0AAguardo o contato para prosseguir.`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    const formatCep = (value: string): string => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
    };

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
                addressInfo: {
                    ...prev.addressInfo,
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
        const postalCode = formData.addressInfo.postalCode.replace(/\D/g, '');
        if (postalCode.length === 8) {
            fetchAddressByCep(postalCode);
        }
    }, [formData.addressInfo.postalCode]);

    const handleInputChange = (section: keyof FormData, field: string, value: string) => {
        // Aplicar formatação específica para alguns campos
        let formattedValue = value;

        if (field === 'postalCode') {
            formattedValue = formatCep(value);
        }

        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: formattedValue
            }
        }));

        // Limpar erro de validação quando o usuário começar a digitar
        if (field === 'name' && validationErrors.name) {
            setValidationErrors(prev => ({ ...prev, name: undefined }));
        }
        if (field === 'email' && validationErrors.email) {
            setValidationErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    return (
        <div className="md:p-20 p-4 mt-15 md:mt-0">
            {!orderCreated && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Truck className="mr-2 h-5 w-5 text-primary-600" />
                            Dados de Entrega
                        </h2>
                        <form>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.addressInfo.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'name', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        readOnly={isLoadingCep}
                                    />
                                    {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.addressInfo.email}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'email', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        readOnly={isLoadingCep}
                                    />
                                    {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                                </div>
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
                                            value={formData.addressInfo.postalCode}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'postalCode', e.target.value)}
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
                                            value={formData.addressInfo.street}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'street', e.target.value)}
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
                                            value={formData.addressInfo.number}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'number', e.target.value)}
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
                                        value={formData.addressInfo.complement}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'complement', e.target.value)}
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
                                        value={formData.addressInfo.neighborhood}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'neighborhood', e.target.value)}
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
                                            value={formData.addressInfo.city}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'city', e.target.value)}
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
                                            value={formData.addressInfo.state}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('addressInfo', 'state', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            readOnly={isLoadingCep}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div>
                        <OrderSummary
                            showCouponInput={false}
                        />
                        <Button
                            onClick={handleCreateOrder}
                            disabled={loading || itens.length === 0}
                            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer w-full"
                        >
                            {loading ? "Gerando pedido..." : "Gerar Pedido"}
                        </Button>
                    </div>
                </div>
            )}

            {orderCreated && (
                <div className="mt-4 space-y-4">
                    <div className="p-4 bg-green-100 border border-green-300 rounded">
                        <p className="font-medium text-green-800">✅ Seu pedido foi gerado com sucesso!</p>
                        <p className="text-sm text-green-700 mt-1">
                            Pedido ID: <span className="font-mono font-bold">#{orderId}</span>
                        </p>
                    </div>
                    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
                        <p className="font-medium text-yellow-800"> ⚠️ Estamos trabalhando para integrar um gateway de pagamento pelo site!</p>
                        <p className="text-sm text-yellow-700 mt-1">
                            Por enquanto, estamos trabalhando com uma forma paliativo através do whatsapp para não perdemos os pedidos!
                        </p>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <p className="font-medium text-blue-800 mb-2">📱 Próximo passo:</p>
                        <p className="text-sm text-blue-700 mb-3">
                            Entre em contato conosco pelo WhatsApp para finalizar o pagamento e coordenar o envio do seu pedido.
                        </p>

                        <Button
                            onClick={handleWhatsAppContact}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <span className="text-lg">💬</span>
                            Chamar no WhatsApp
                        </Button>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                        <p className="text-xs text-yellow-800">
                            💡 Tenha o ID do pedido em mãos para agilizar o atendimento
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderPage;