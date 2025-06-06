import { useCart } from "@/context/CartContext";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { CreditCard, Loader2, Lock, QrCode, MapPin } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type PaymentMethod = 'card' | 'pix';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cleanCart } = useCart();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [paymentElementKey, setPaymentElementKey] = useState(0);

    // Atualiza o PaymentElement quando o método muda
    useEffect(() => {
        setPaymentElementKey(prev => prev + 1);
    }, [paymentMethod]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setMessage('');

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
                receipt_email: customerEmail,
            },
        });

        if (error) {
            if (error.type === 'card_error' || error.type === 'validation_error') {
                setMessage(error.message || 'Erro no pagamento');
            } else {
                setMessage('Ocorreu um erro inesperado');
            }
        } else {
            // Pagamento bem-sucedido
            cleanCart();
            navigate('/payment-success');
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">Informações de Pagamento</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email do cliente */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email para recibo
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="seu-email@exemplo.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Seletor de método de pagamento */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Método de pagamento
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'card'
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <CreditCard className="h-6 w-6" />
                            <span className="text-sm font-medium">Cartão de Crédito</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('pix')}
                            className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'pix'
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <QrCode className="h-6 w-6" />
                            <span className="text-sm font-medium">PIX</span>
                        </button>
                    </div>
                </div>

                {/* Endereço de entrega */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Endereço de entrega
                    </label>
                    <AddressElement
                        options={{
                            mode: 'shipping',
                            allowedCountries: ['BR'],
                        }}
                    />
                </div>

                {/* Elemento de pagamento do Stripe */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {paymentMethod === 'card' ? 'Dados do cartão' : null}
                    </label>
                    {paymentMethod === 'card' && (
                        <PaymentElement
                            key={paymentElementKey}
                            options={{
                                wallets: {
                                    applePay: 'never',
                                    googlePay: 'never',
                                },
                                paymentMethodOrder: ['card'],
                                fields: {
                                    billingDetails: 'auto'
                                }
                            }}
                        />
                    )}
                </div>

                {/* Informação sobre PIX */}
                {paymentMethod === 'pix' && (
                    <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-700">
                            <QrCode className="h-4 w-4 inline mr-1" />
                            Após confirmar, você será redirecionado para gerar o QR Code do PIX
                        </p>
                    </div>
                )}

                {/* Mensagem de erro */}
                {message && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200">
                        <p className="text-sm text-red-700">{message}</p>
                    </div>
                )}

                {/* Botão de pagamento */}
                <button
                    type="submit"
                    disabled={isLoading || !stripe || !elements}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processando...
                        </>
                    ) : (
                        <>
                            {paymentMethod === 'card' ? (
                                <><CreditCard className="h-4 w-4" /> Pagar com Cartão</>
                            ) : (
                                <><QrCode className="h-4 w-4" /> Pagar com PIX</>
                            )}
                        </>
                    )}
                </button>

                {/* Informações de segurança */}
                <div className="text-xs text-gray-500 text-center">
                    <Lock className="h-3 w-3 inline mr-1" />
                    Seus dados estão protegidos com criptografia SSL
                </div>
            </form>
        </div>
    );
}

export default CheckoutForm;