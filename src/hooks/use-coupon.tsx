import { validateCouponRequest } from "@/clients/coupon";
import { Coupon, CouponState, CouponType } from "@/types/coupon";
import { useCallback, useState } from "react";

export const useCoupon = () => {
    const [state, setState] = useState<CouponState>({
        coupon: null,
        loading: false,
        error: null
    });

    const validateCoupon = useCallback(async (code: string): Promise<Coupon | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await validateCouponRequest(code);
            const coupon: Coupon = response.coupon;

            const now = new Date();
            const expiresAt = new Date(coupon.expiresAt);

            if (!coupon.isActive) {
                throw new Error('Cupom não está ativo.');
            }

            if (expiresAt < now) {
                throw new Error('Cupom expirado.');
            }

            if (coupon.usedCount >= coupon.usageLimit) {
                throw new Error('Cupom esgotado.');
            }

            setState(prev => ({ ...prev, coupon, loading: false }));
            return coupon;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
            setState(prev => ({ ...prev, error: errorMessage, loading: false, coupon: null }));
            return null;
        }
    }, []);

    const applyCoupon = useCallback((coupon: Coupon) => {
        setState(prev => ({ ...prev, coupon, error: null }));
    }, []);

    const removeCoupon = useCallback(() => {
        setState(prev => ({ ...prev, coupon: null, error: null }));
    }, []);

    const calculateDiscount = useCallback((subtotal: number, shippingCost: number = 0): {
        discount: number;
        discountType: string;
        finalTotal: number;
        shippingDiscount: number;
    } => {
        if (!state.coupon) {
            return {
                discount: 0,
                discountType: '',
                finalTotal: subtotal + shippingCost,
                shippingDiscount: 0
            };
        }

        const { coupon } = state;
        let discount = 0;
        let shippingDiscount = 0;
        let discountType = '';

        if (subtotal < coupon.minPurchaseValue) {
            return {
                discount: 0,
                discountType: `Valor mínimo de R$ ${coupon.minPurchaseValue.toFixed(2)} não atingido`,
                finalTotal: subtotal + shippingCost,
                shippingDiscount: 0
            };
        }

        switch (coupon.type) {
            case CouponType.Percent:
                discount = (subtotal * coupon.value) / 100;
                discountType = `${coupon.value}% de desconto`;
                break;

            case CouponType.Fixed:
                discount = Math.min(coupon.value, subtotal);
                discountType = `R$ ${coupon.value.toFixed(2)} de desconto.`;
                break;

            case CouponType.FreeShipping:
                shippingDiscount = shippingCost;
                discountType = 'Frete grátis';
                break;
        }

        const finalTotal = subtotal - discount + shippingCost - shippingDiscount;

        return {
            discount,
            discountType,
            finalTotal: Math.max(0, finalTotal),
            shippingDiscount
        };
    }, [state.coupon]);

    return {
        coupon: state.coupon,
        loading: state.loading,
        error: state.error,
        validateCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount
    };
};