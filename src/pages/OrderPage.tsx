import { createOrder } from "@/clients/order";
import OrderSummary from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Loader2, Truck } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManualOrderConfirmation from "@/components/ManualOrderConfirmation";
import { usePaymentMode } from "@/hooks/usePaymentMode";

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
    const { itens, clearCart, finalTotal, appliedCoupon } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderError, setOrderError] = useState<string>('');
    const navigate = useNavigate();
    const { mode: paymentMode, loading: loadingPaymentMode } = usePaymentMode();
    const [manualOrderId, setManualOrderId] = useState<string>('');
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
        setOrderError('');
        try {
            const orderSummaryRequest = {
                albums: itens.map(item => ({
                    albumId: item.album.id,
                    schoolId: item.album.schoolId,
                    albumName: item.album.name,
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
                // O backend recalcula o total; o código do cupom vai para ele aplicar o desconto.
                priceTotal: finalTotal(),
                couponCode: appliedCoupon?.code
            };

            const response = await createOrder(orderSummaryRequest);

            clearCart(); // limpa o carrinho após o pedido

            if (paymentMode === 'mercadoPagoPix') {
                navigate(`/pedido/${response.id}/pagamento`);
            } else {
                setManualOrderId(response.id);
            }
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            setOrderError('Não foi possível gerar o pedido. Confira os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
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

    if (manualOrderId) {
        return (
            <div className="md:p-20 p-4 mt-15 md:mt-0">
                <ManualOrderConfirmation orderId={manualOrderId} customerName={formData.addressInfo.name} />
            </div>
        );
    }

    return (
        <div className="md:p-20 p-4 mt-15 md:mt-0">
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
                        disabled={loading || loadingPaymentMode || itens.length === 0}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer w-full"
                    >
                        {loading
                            ? "Gerando pedido..."
                            : paymentMode === 'mercadoPagoPix' ? "Ir para o pagamento com Pix" : "Gerar Pedido"}
                    </Button>
                    {orderError && <p className="text-red-600 text-sm mt-2">{orderError}</p>}
                </div>
            </div>

        </div>
    );
};

export default OrderPage;