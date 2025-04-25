import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormData } from "./CheckoutPage";
import PixQrCode from "../components/PixQrCode";
import { simulatePayment, checkStatus, createQrCodePix } from "../clients/pix";
import { GeneratePixQrCode, PixQrCodeResponseData } from "../types";

interface LocationState {
    formData: FormData;
    totalAmount: number;
}

// Define types for status
type PixStatus = "PENDING" | "PAID" | "CANCELED";

const StatusBadge = ({ status }: { status: PixStatus | null }) => {
    console.log(status);
    if (!status) return null;

    const getBadgeStyles = () => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-800 border-green-200";
            case "CANCELED":
                return "bg-red-100 text-red-800 border-red-200";
            case "PENDING":
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "PAID":
                return "Pago";
            case "CANCELED":
                return "Cancelado";
            case "PENDING":
            default:
                return "Pendente";
        }
    };

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBadgeStyles()}`}>
            {status === "PAID" && (
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )}
            {status === "PENDING" && (
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
            )}
            {status === "CANCELED" && (
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )}
            {getStatusText()}
        </div>
    );
};

const PixPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, totalAmount } = location.state as LocationState || {};

    const [isGeneratingPix, setIsGeneratingPix] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PixStatus | null>("PENDING");
    const [statusPolling, setStatusPolling] = useState<NodeJS.Timeout | null>(null);
    const [pixData, setPixData] = useState<PixQrCodeResponseData | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!formData) {
            navigate('/checkout');
        }
    }, [formData, navigate]);

    if (!formData) {
        return null;
    }

    // First useEffect to generate PIX - runs once
    useEffect(() => {
        const generatePixPayment = async () => {
            if (isGeneratingPix || pixData) return; // Skip if already generating or have data

            setIsGeneratingPix(true);

            const cleanCpf = formData.personalInfo.cpf.replace(/\D/g, '');
            const cleanPhone = formData.personalInfo.phone.replace(/\D/g, '');

            try {
                const pixRequest: GeneratePixQrCode = {
                    amount: totalAmount,
                    expiresIn: 3600,
                    description: `Pedido de figurinhas - ${new Date().toISOString()}`,
                    customer: {
                        name: formData.personalInfo.name,
                        email: formData.personalInfo.email,
                        taxId: cleanCpf,
                        cellphone: cleanPhone
                    },
                };
                const response = await createQrCodePix(pixRequest, {
                    zipCode: formData.deliveryInfo.cep,
                    street: formData.deliveryInfo.street,
                    number: formData.deliveryInfo.number,
                    complement: formData.deliveryInfo.complement,
                    neighborhood: formData.deliveryInfo.neighborhood,
                    city: formData.deliveryInfo.city,
                    state: formData.deliveryInfo.state
                });

                if (response.error) {
                    setError(response.error);
                    return;
                }
                setPixData(response.data);
                setIsGeneratingPix(false);
            } catch (err) {
                console.error('Error generating PIX:', err);
                setIsGeneratingPix(false); // Reset flag on error
            }
        };

        generatePixPayment();
        startStatusPolling();
    }, []); // Empty dependency array runs only once

    // New useEffect to fetch payment status
    const fetchPaymentStatus = async () => {
        if (!pixData?.id) return;

        try {
            const response = await checkStatus(pixData.id);
            setPaymentStatus(response.status);

            // If payment is completed or canceled, stop polling
            if (response.status === "PAID" || response.status === "CANCELED") {
                if (statusPolling) {
                    clearInterval(statusPolling);
                    setStatusPolling(null);
                }
            }
        } catch (err) {
            console.error('Error checking payment status:', err);
        }
    };

    // Start polling for status updates
    const startStatusPolling = () => {
        // First check immediately
        fetchPaymentStatus();

        // Then check every 5 seconds
        const interval = setInterval(fetchPaymentStatus, 5000);
        setStatusPolling(interval);

        // Clean up interval on component unmount
        return () => {
            if (statusPolling) {
                clearInterval(statusPolling);
            }
        };
    };

    // Clean up polling on unmount
    useEffect(() => {
        return () => {
            if (statusPolling) {
                clearInterval(statusPolling);
            }
        };
    }, [statusPolling]);

    const handleSimulatePayment = async () => {
        if (!pixData?.id) return;

        await simulatePayment(pixData.id, 'PAID');
        // Immediately fetch the new status after simulation
        fetchPaymentStatus();
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-10 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Pagamento via PIX</h1>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Status do Pagamento</h2>
                    <StatusBadge status={paymentStatus} />
                </div>

                <PixQrCode
                    isLoading={isGeneratingPix}
                    error={error}
                    brCode={pixData?.brCode}
                    brCodeBase64={pixData?.brCodeBase64}
                    amount={totalAmount}
                    expiresAt={pixData?.expiresAt ? new Date(pixData.expiresAt) : undefined}
                />

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p className="mt-2">O código PIX expira em 1 hora.</p>
                </div>

                {paymentStatus !== "PAID" && (
                    <button
                        onClick={handleSimulatePayment}
                        className="mt-4 w-full cursor-pointer bg-green-400 hover:bg-green-500 p-3 rounded text-white font-medium transition-colors"
                    >
                        Simular pagamento
                    </button>
                )}

                {paymentStatus === "PAID" && (
                    <div className="mt-4 text-center text-green-600 animate-pulse">
                        <p className="font-medium">Pagamento confirmado!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PixPage;