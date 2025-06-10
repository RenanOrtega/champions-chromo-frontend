
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft, CreditCard, ShoppingBag } from 'lucide-react';
import stripePromise from '@/lib/stripe';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import { createPaymentIntentRequest } from '@/clients/pix';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { calculateOrderTotals, itens } = useCart();
    const [clientSecret, setClientSecret] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const shippingCost = 0;
    const totals = calculateOrderTotals(shippingCost);

    useEffect(() => {
        createPaymentIntent();
    }, [totals.finalTotal]);

    const createPaymentIntent = async () => {
        try {
            setLoading(true);
            const response = await createPaymentIntentRequest({
                amount: Math.round(totals.finalTotal * 100),
                currency: 'brl',
                items: itens
            })

            setClientSecret(response.clientSecret);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    if (itens.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Carrinho vazio</h2>
                <p className="text-gray-500 text-center mb-6">
                    Adicione itens ao carrinho antes de fazer o checkout
                </p>
                <button
                    onClick={() => navigate('/schools')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                    Continuar comprando
                </button>
            </div>
        );
    }

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '8px',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center space-x-2 mb-6">
                <button
                    onClick={() => navigate('/cart')}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    Checkout
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="order-2 lg:order-1">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                            </div>
                        </div>
                    ) : clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <p className="text-gray-500">Preparando checkout...</p>
                        </div>
                    )}
                </div>

                <div className="order-1 lg:order-2">
                    <OrderSummary
                        shippingCost={shippingCost}
                        showCouponInput={false}
                        showFinishButton={false}
                        className="sticky top-4"
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;