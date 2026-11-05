import { createPixPayment, getPaymentStatus } from "@/clients/payment";
import { Button } from "@/components/ui/button";
import { PixPayment } from "@/types/payment";
import { isAxiosError } from "axios";
import { CheckCircle2, Copy, Loader2, QrCode, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const WHATSAPP_NUMBER = "5511973719123";
const POLL_INTERVAL_MS = 5000;

const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const errorMessage = (error: unknown) => {
    if (isAxiosError(error)) {
        if (error.response?.status === 429) return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
        if (typeof error.response?.data === "string" && error.response.data) return error.response.data;
    }
    return "Não foi possível gerar o Pix agora. Tente novamente em instantes.";
};

const useCountdown = (expiresAt?: string | null) => {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!expiresAt) return;
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, [expiresAt]);

    if (!expiresAt) return { expired: false, label: "" };

    const remaining = Math.max(0, new Date(expiresAt).getTime() - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return {
        expired: remaining === 0,
        label: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    };
};

const PaymentPage = () => {
    const { orderId = "" } = useParams();
    const [payment, setPayment] = useState<PixPayment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const { expired: timeExpired, label: countdown } = useCountdown(payment?.expiresAt);
    const isPaid = payment?.status === "paid";
    const isExpired = payment?.status === "expired" || payment?.status === "cancelled"
        || (payment?.status === "awaitingPayment" && timeExpired);

    // Only one Pix request at a time (React StrictMode runs effects twice in dev, and users double click).
    const pixRequest = useRef<Promise<PixPayment> | null>(null);

    const generatePix = useCallback(async () => {
        if (pixRequest.current) return;

        setLoading(true);
        setError("");
        pixRequest.current = createPixPayment(orderId);
        try {
            setPayment(await pixRequest.current);
            setError("");
        } catch (e) {
            setError(errorMessage(e));
        } finally {
            pixRequest.current = null;
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        generatePix();
    }, [generatePix]);

    // Polls while the customer is paying. The backend is updated by the Mercado Pago webhook.
    useEffect(() => {
        if (payment?.status !== "awaitingPayment" || timeExpired) return;

        const timer = setInterval(async () => {
            try {
                const latest = await getPaymentStatus(orderId);
                setPayment(prev => ({ ...prev, ...latest, qrCode: latest.qrCode ?? prev?.qrCode, qrCodeBase64: latest.qrCodeBase64 ?? prev?.qrCodeBase64 }));
            } catch {
                // Keep polling; a temporary failure should not break the screen.
            }
        }, POLL_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [orderId, payment?.status, timeExpired]);

    const handleCopy = async () => {
        if (!payment?.qrCode) return;
        try {
            await navigator.clipboard.writeText(payment.qrCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch {
            setCopied(false);
        }
    };

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Olá! Preciso de ajuda com o pagamento do pedido ${orderId}.`
    )}`;

    return (
        <div className="md:p-20 p-4 mt-15 md:mt-0 flex justify-center">
            <div className="w-full max-w-lg space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-sm text-gray-500">
                        Pedido <span className="font-mono font-bold">#{orderId}</span>
                    </p>

                    {loading && !payment && (
                        <div className="py-12 flex flex-col items-center gap-3 text-gray-600">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            Gerando seu Pix...
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm space-y-3">
                            <p>{error}</p>
                            <Button onClick={generatePix} disabled={loading} className="cursor-pointer">
                                Tentar novamente
                            </Button>
                        </div>
                    )}

                    {isPaid && (
                        <div className="py-8 flex flex-col items-center gap-3">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                            <h1 className="text-2xl font-semibold text-green-700">Pagamento confirmado!</h1>
                            <p className="text-gray-600">
                                Recebemos seu pagamento de {formatPrice(payment.amount)}. Em breve entraremos em contato
                                pelo email informado para combinar a entrega.
                            </p>
                            <Link to="/" className="text-blue-600 underline mt-2">Voltar para a loja</Link>
                        </div>
                    )}

                    {!isPaid && isExpired && (
                        <div className="py-8 flex flex-col items-center gap-3">
                            <h1 className="text-xl font-semibold">Este Pix expirou</h1>
                            <p className="text-gray-600 text-sm">Gere um novo código para concluir o pagamento do seu pedido.</p>
                            <Button onClick={generatePix} disabled={loading} className="cursor-pointer">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Gerar novo Pix
                            </Button>
                        </div>
                    )}

                    {!isPaid && !isExpired && payment?.status === "awaitingPayment" && (
                        <div className="mt-4 space-y-4">
                            <h1 className="text-xl font-semibold flex items-center justify-center gap-2">
                                <QrCode className="h-5 w-5" /> Pague com Pix
                            </h1>
                            <p className="text-3xl font-bold">{formatPrice(payment.amount)}</p>

                            {payment.qrCodeBase64 ? (
                                <img
                                    src={`data:image/png;base64,${payment.qrCodeBase64}`}
                                    alt="QR Code Pix"
                                    className="mx-auto w-56 h-56"
                                />
                            ) : payment.ticketUrl && (
                                <a href={payment.ticketUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                    Abrir QR Code do Pix
                                </a>
                            )}

                            {payment.qrCode && (
                                <div className="space-y-2 text-left">
                                    <label htmlFor="pix-code" className="text-sm font-medium text-gray-700">Pix copia e cola</label>
                                    <div className="flex gap-2">
                                        <input
                                            id="pix-code"
                                            readOnly
                                            value={payment.qrCode}
                                            onFocus={e => e.target.select()}
                                            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-xs font-mono"
                                        />
                                        <Button onClick={handleCopy} className="cursor-pointer shrink-0">
                                            <Copy className="h-4 w-4" />
                                            {copied ? "Copiado!" : "Copiar"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Aguardando pagamento{countdown && <> · expira em <span className="font-mono">{countdown}</span></>}
                            </div>
                            <p className="text-xs text-gray-500">
                                Abra o app do seu banco, escolha pagar com Pix e escaneie o QR Code ou cole o código.
                                Esta página atualiza sozinha quando o pagamento for confirmado.
                            </p>
                        </div>
                    )}
                </div>

                {!isPaid && (
                    <p className="text-center text-xs text-gray-500">
                        Problemas com o pagamento?{" "}
                        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-green-700 underline">
                            Fale com a gente no WhatsApp
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
