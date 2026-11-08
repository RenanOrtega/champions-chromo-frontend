import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "5511973719123";

// Checkout used while online payment is switched off (Payments__Mode = Manual).
const ManualOrderConfirmation = ({ orderId, customerName }: { orderId: string; customerName: string }) => {
    const handleWhatsAppContact = () => {
        const message = encodeURIComponent(
            `Olá, meu nome é ${customerName}\n\nGostaria de finalizar o pagamento e envio do meu pedido.\n\nPedido ID: ${orderId}\n\nAguardo o contato para prosseguir.`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="p-4 bg-green-100 border border-green-300 rounded">
                <p className="font-medium text-green-800">✅ Seu pedido foi gerado com sucesso!</p>
                <p className="text-sm text-green-700 mt-1">
                    Pedido ID: <span className="font-mono font-bold">#{orderId}</span>
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
    );
};

export default ManualOrderConfirmation;
