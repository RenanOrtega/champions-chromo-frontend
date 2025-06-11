import { createOrder } from "@/clients/order";
import OrderSummary from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const OrderPage = () => {
    const { itens, clearCart, finalTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderId, setOrderId] = useState<string>('');

    const WHATSAPP_NUMBER = "5511973719123";

    const handleCreateOrder = async () => {
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
        const message = `Olá! Gostaria de finalizar o pagamento e envio do meu pedido.%0A%0APedido ID: ${orderId}%0A%0AAguardo o contato para prosseguir.`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="max-w-2xl mx-auto p-4 mt-15">
            {!orderCreated && (
                <>
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
                </>
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