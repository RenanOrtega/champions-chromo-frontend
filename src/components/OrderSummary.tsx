import { useCart } from "@/context/CartContext"
import { CouponInput } from "./CouponInput";
import { stickerTypeInfo } from "@/types/album";
import { AlertCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

const OrderSummary = ({
    shippingCost = 0,
    showCouponInput = true,
    showFinishButton = false,
    onFinishOrder,
    finishError,
    className = ""
}: {
    shippingCost?: number;
    showCouponInput?: boolean;
    showFinishButton?: boolean;
    onFinishOrder?: () => void;
    finishError?: string | null;
    className?: string;
}) => {
    const {
        itens,
        appliedCoupon,
        calculateOrderTotals
    } = useCart();

    const { subtotal, discount, shippingDiscount, finalTotal, discountType } = calculateOrderTotals(shippingCost);

    return (
        <div className={`rounded-lg border border-slate-200 bg-white p-5 ${className}`}>
            <h2 className="mb-4 text-base font-semibold text-slate-900">Resumo do pedido</h2>

            {showCouponInput && (
                <div className="mb-5">
                    <CouponInput />
                </div>
            )}

            {itens.map((item) => (
                <div key={item.album.id} className="mb-4">
                    <p className="mb-1.5 text-sm font-semibold text-slate-900">{item.album.name}</p>
                    {item.stickers.map(sticker => (
                        <div key={sticker.id} className="flex justify-between gap-3 py-0.5 text-sm text-slate-600 tabular-nums">
                            <p>
                                {sticker.quantity}× Nº {sticker.number} {stickerTypeInfo[sticker.type].name}
                            </p>
                            <p>{formatPrice(sticker.price * sticker.quantity)}</p>
                        </div>
                    ))}

                    {itens.length > 1 && (
                        <div className="mt-1.5 flex justify-between border-t border-slate-100 pt-1.5 text-sm font-medium text-slate-800 tabular-nums">
                            <p>Subtotal do álbum</p>
                            <p>{formatPrice(item.stickers.reduce((sum, s) => sum + (s.price * s.quantity), 0))}</p>
                        </div>
                    )}
                </div>
            ))}

            <div className="space-y-2 border-t border-slate-200 pt-4 tabular-nums">
                {/* Subtotal */}
                <div className="flex justify-between text-sm text-slate-700">
                    <p>Subtotal</p>
                    <p>{formatPrice(subtotal)}</p>
                </div>

                {/* Desconto do cupom */}
                {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                        <div className="flex items-center gap-1.5">
                            <Tag className="size-4" />
                            <p>Desconto ({appliedCoupon.code})</p>
                        </div>
                        <p>-{formatPrice(discount)}</p>
                    </div>
                )}

                {/* Frete grátis */}
                {appliedCoupon && shippingDiscount > 0 ?
                    <div className="flex justify-between text-sm text-green-700">
                        <div className="flex items-center gap-1.5">
                            <Tag className="size-4" />
                            <p>Frete grátis ({appliedCoupon.code})</p>
                        </div>
                        <p>-{formatPrice(shippingDiscount)}</p>
                    </div>
                    : <div className="flex justify-between text-sm text-slate-700">
                        <p>Frete</p>
                        <p>{formatPrice(shippingCost)}</p>
                    </div>}

                {/* Aviso de valor mínimo */}
                {appliedCoupon && discountType.includes('Valor mínimo') && (
                    <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-2.5 text-sm text-amber-900">
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        <p>{discountType}</p>
                    </div>
                )}

                {/* Total */}
                <div className="flex items-baseline justify-between border-t border-slate-200 pt-3">
                    <p className="font-semibold text-slate-900">Total</p>
                    <p className="text-xl font-bold text-slate-900">{formatPrice(finalTotal)}</p>
                </div>
            </div>
            {showFinishButton && (
                <>
                    {finishError && (
                        <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-red-700">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            {finishError}
                        </p>
                    )}
                    <Button onClick={onFinishOrder} className="mt-4 h-11 w-full text-base">
                        Finalizar pedido
                    </Button>
                </>
            )}
        </div>
    );
};

export default OrderSummary;
