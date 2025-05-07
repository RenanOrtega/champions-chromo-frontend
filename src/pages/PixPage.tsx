import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FormData } from "./CheckoutPage";
import PixQrCode from "../components/PixQrCode";
import { simulatePayment, checkStatus, createPixOrder } from "../clients/pix";
import { CreateOrder, PixQrCodeResponseData, PixStatus } from "../types/pix";
import { useCart } from "../context/CartContext";

interface LocationState {
  formData: FormData;
  totalAmount: number;
}

interface PixCache {
  pixData: PixQrCodeResponseData;
  expiresAt: Date;
  formDataHash: string;
}

const createFormDataHash = (formData: FormData, amount: number): string => {
  const { personalInfo } = formData;
  return `${personalInfo.cpf}-${personalInfo.email}-${amount}`;
};

const StatusBadge = ({ status }: { status: PixStatus | null }) => {
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
  const { cleanCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, totalAmount } = location.state as LocationState || {};

  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PixStatus | null>("PENDING");
  const [statusPolling, setStatusPolling] = useState<NodeJS.Timeout | null>(null);
  const [pixData, setPixData] = useState<PixQrCodeResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    if (!formData) {
      navigate('/checkout');
      return;
    }
  }, [formData, navigate]);

  const convertToCents = (amount: number) => {
    return Math.floor(amount * 100);
  }

  useEffect(() => {
    const loadOrGeneratePixPayment = async () => {
      if (isGeneratingPix || pixData) return;
      setIsGeneratingPix(true);

      try {
        const currentFormHash = createFormDataHash(formData, totalAmount);

        const cachedPixJson = localStorage.getItem('pixQrCodeCache');

        if (cachedPixJson) {
          const cachedPix = JSON.parse(cachedPixJson) as PixCache;

          const cacheExpiry = new Date(cachedPix.expiresAt);
          const isValid = cacheExpiry > new Date() && cachedPix.formDataHash === currentFormHash;

          if (isValid) {
            console.log('Using cached PIX data');
            setPixData(cachedPix.pixData);
            setIsGeneratingPix(false);
            return;
          } else {
            console.log('Cached PIX data expired or invalid, generating new one');
            localStorage.removeItem('pixQrCodeCache');
          }
        }

        const cleanCpf = formData.personalInfo.cpf.replace(/\D/g, '');
        const cleanPhone = formData.personalInfo.phone.replace(/\D/g, '');

        const createOrder: CreateOrder = {
          payment: { amount: convertToCents(totalAmount) },
          expiresIn: 3600,
          description: `Pedido de figurinhas - ${new Date().toISOString()}`,
          customer: {
            name: formData.personalInfo.name,
            email: formData.personalInfo.email,
            taxId: cleanCpf,
            cellphone: cleanPhone
          },
          address: {
            zipCode: formData.deliveryInfo.cep,
            street: formData.deliveryInfo.street,
            number: formData.deliveryInfo.number,
            complement: formData.deliveryInfo.complement,
            neighborhood: formData.deliveryInfo.neighborhood,
            city: formData.deliveryInfo.city,
            state: formData.deliveryInfo.state
          }
        };
        const response = await createPixOrder(createOrder);

        if (response.error) {
          setError(response.error);
        } else {
          setPixData(response.data);

          if (response.data && response.data.expiresAt) {
            const pixCache: PixCache = {
              pixData: response.data,
              expiresAt: response.data.expiresAt,
              formDataHash: currentFormHash
            };
            localStorage.setItem('pixQrCodeCache', JSON.stringify(pixCache));
          }
        }
      } catch (err) {
        setError('Failed to generate PIX code');
      } finally {
        setIsGeneratingPix(false);
        setHasAttemptedLoad(true);
      }
    };

    if (formData && !isGeneratingPix && !pixData && !hasAttemptedLoad) {
      loadOrGeneratePixPayment();
    }
  }, [formData, isGeneratingPix, pixData, totalAmount, hasAttemptedLoad]);

  useEffect(() => {
    if (!pixData?.id) return;

    const fetchPaymentStatus = async () => {
      try {
        const response = await checkStatus(pixData.id);
        setPaymentStatus(response.status);

        if (response.status === "PAID" || response.status === "CANCELED") {
          if (statusPolling) {
            clearInterval(statusPolling);
            setStatusPolling(null);
          }

          if (response.status === "PAID") {
            cleanCart();
            setTimeout(() => {
              navigate('/success')
            }, 1000);
          }

          localStorage.removeItem('pixQrCodeCache');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    };

    fetchPaymentStatus();

    const interval = setInterval(fetchPaymentStatus, 5000);
    setStatusPolling(interval);

    return () => {
      clearInterval(interval);
    };
  }, [pixData, cleanCart]);

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
  };

  const handleClearCache = () => {
    localStorage.removeItem('pixQrCodeCache');
    setPixData(null);
    setPaymentStatus("PENDING");
    setError(null);
    setHasAttemptedLoad(false);
  };

  const handleSuccess = () => {
    navigate('/success');
  }

  if (!formData) {
    return null;
  }

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

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSimulatePayment}
            className="mt-4 w-full cursor-pointer bg-green-400 hover:bg-green-500 p-3 rounded text-white font-medium transition-colors"
          >
            Simular pagamento
          </button>

          <button
            onClick={handleClearCache}
            className="w-full cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded text-gray-700 text-sm transition-colors"
          >
            Gerar novo código PIX
          </button>
        </div>
      </div>
    </div>
  );
};

export default PixPage;