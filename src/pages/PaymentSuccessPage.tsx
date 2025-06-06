import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { getPaymentDetailsRequest } from '@/clients/pix';
import { PaymentDetailsResponse } from '@/types/pix';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsResponse>();
    const [loading, setLoading] = useState(true);

    const paymentIntentId = searchParams.get('payment_intent');

    useEffect(() => {
        if (paymentIntentId) {
            fetchPaymentDetails();
        } else {
            setLoading(false);
        }
    }, [paymentIntentId]);

    const fetchPaymentDetails = async () => {
        try {
            const response = await getPaymentDetailsRequest(paymentIntentId!);
            setPaymentDetails(response);
        } catch (error) {
            console.error('Erro ao buscar detalhes do pagamento:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Pagamento Aprovado!
                    </h1>
                    <p className="text-gray-600">
                        Seu pedido foi processado com sucesso
                    </p>
                </div>

                {paymentDetails && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-900 mb-2">Detalhes do Pedido</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>ID do Pagamento:</span>
                                <span className="font-mono">{paymentDetails.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Valor:</span>
                                <span className="font-semibold">
                                     R$ {(paymentDetails.amount / 100).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="text-green-600 font-semibold">Aprovado</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/schools')}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 flex items-center justify-center gap-2"
                    >
                        Continuar Comprando
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;