import { useCart } from "@/context/CartContext"
import { CouponInput } from "./CouponInput";
import { stickerTypeInfo } from "@/types/album";
import { AlertCircle, CreditCard, Tag } from "lucide-react";

const OrderSummary = ({
    shippingCost = 0,
    showCouponInput = true,
    showFinishButton = false,
    onFinishOrder,
    className = ""
}: {
    shippingCost?: number;
    showCouponInput?: boolean;
    showFinishButton?: boolean;
    onFinishOrder?: () => void;
    className?: string;
}) => {
    const {
        itens,
        appliedCoupon,
        calculateOrderTotals
    } = useCart();

    const { subtotal, discount, shippingDiscount, finalTotal, discountType } = calculateOrderTotals(shippingCost);

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
            <h3 className="font-semibold mb-4">Resumo do pedido</h3>

            {showCouponInput && (
                <div className="mb-4">
                    <CouponInput />
                </div>
            )}

            {itens.map((item) => (
                <div key={item.album.id} className="mb-4">
                    <p className="font-medium text-sm mb-2">{item.album.name}</p>
                    {item.stickers.map(sticker => (
                        <div key={sticker.id} className="flex justify-between text-xs text-gray-600 mt-1">
                            <p>
                                #{sticker.number} ({stickerTypeInfo[sticker.type].name}) x{sticker.quantity}
                            </p>
                            <p>R$ {(sticker.price * sticker.quantity).toFixed(2)}</p>
                        </div>
                    ))}

                    <div className="flex justify-between text-xs font-medium text-gray-800 mt-2 pt-2 border-t border-gray-100">
                        <p>Subtotal do álbum:</p>
                        <p>R$ {(item.stickers.reduce((sum, s) => sum + (s.price * s.quantity), 0)).toFixed(2)}</p>
                    </div>
                </div>
            ))}

            <div className="border-t border-gray-200 my-4 pt-4 space-y-2">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                    <p>Subtotal</p>
                    <p>R$ {subtotal.toFixed(2)}</p>
                </div>

                {/* Desconto do cupom */}
                {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <div className="flex items-center space-x-1">
                            <Tag className="h-4 w-4" />
                            <p>Desconto ({appliedCoupon.code})</p>
                        </div>
                        <p>-R$ {discount.toFixed(2)}</p>
                    </div>
                )}

                {/* Frete grátis */}
                {appliedCoupon && shippingDiscount > 0 ?
                    <div className="flex justify-between text-sm text-green-600">
                        <div className="flex items-center space-x-1">
                            <Tag className="h-4 w-4" />
                            <p>Frete grátis ({appliedCoupon.code})</p>
                        </div>
                        <p>-R$ {shippingDiscount.toFixed(2)}</p>
                    </div>
                    : <div className="flex justify-between text-sm">
                        <p>Frete</p>
                        <p className={shippingDiscount > 0 ? 'line-through text-gray-400' : ''}>
                            R$ {shippingCost.toFixed(2)}
                        </p>
                    </div>}

                {/* Aviso de valor mínimo */}
                {appliedCoupon && discountType.includes('Valor mínimo') && (
                    <div className="flex items-start space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>{discountType}</p>
                    </div>
                )}

                {/* Total */}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                    <p>Total</p>
                    <p>R$ {finalTotal.toFixed(2)}</p>
                </div>
            </div>
            {showFinishButton && (
                <button
                    onClick={onFinishOrder}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 font-medium flex items-center justify-center gap-2"
                >
                    <CreditCard className="h-4 w-4" />
                    Finalizar Pedido
                </button>
            )}
        </div>
    );
};

export default OrderSummary;