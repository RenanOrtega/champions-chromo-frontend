import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { useState } from "react";

interface PixQrCodeProps {
  isLoading: boolean;
  error: string | null;
  brCode?: string;
  brCodeBase64?: string;
  amount: number;
  expiresAt?: Date;
}

const PixQrCode: React.FC<PixQrCodeProps> = ({
  isLoading,
  error,
  brCode,
  brCodeBase64,
  amount,
  expiresAt
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyBrCode = () => {
    if (brCode) {
      navigator.clipboard.writeText(brCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatExpirationTime = (date?: Date) => {
    if (!date) return 'N/A';

    const expiryDate = new Date(date);
    return expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-2" />
          <p className="text-gray-700">Gerando QR Code PIX...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg">
        <p className="text-red-600 font-medium mb-2">Erro ao gerar o PIX</p>
        <p className="text-sm text-red-500">{error}</p>
        <p className="text-sm text-gray-600 mt-4">
          Por favor, tente novamente ou escolha outra forma de pagamento.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <p className="text-gray-700 font-medium mb-2 text-center">QR Code PIX</p>

      {brCodeBase64 ? (
        <div className="mx-auto mb-4 flex items-center justify-center">
          <img
            src={`${brCodeBase64}`}
            alt="QR Code PIX"
            className="w-48 h-48"
          />
        </div>
      ) : (
        <div className="w-48 h-48 bg-gray-300 mx-auto mb-4 flex items-center justify-center">
          <span className="text-gray-500">QR Code não disponível</span>
        </div>
      )}

      <div className="text-center">
        <p className="text-sm font-medium mb-1">Valor: R$ {amount.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mb-4">
          Expira às {formatExpirationTime(expiresAt)}
        </p>
      </div>

      {brCode && (
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Código PIX Copia e Cola:</p>
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-300">
            <div className="truncate text-xs text-gray-600 flex-1 pr-2">
              {brCode}
            </div>
            <button
              onClick={handleCopyBrCode}
              className="text-primary-600 hover:text-primary-700 focus:outline-none"
            >
              {copied ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-1">Código PIX copiado!</p>
          )}
        </div>
      )}

      <p className="text-sm text-gray-600 mt-4">
        Escaneie o QR Code ou use o código "Copia e Cola" para pagar
      </p>
    </div>
  );
};

export default PixQrCode;