import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useCart } from '@/context/CartContext';
import { validateCouponRequest } from '@/clients/coupon';
import { Coupon } from '@/types/coupon';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

interface CouponInputProps {
    className?: string;
}

// A API pode devolver o tipo como número (0, 1, 2) ou como texto.
const describeCoupon = (coupon: Coupon) => {
    const type = coupon.type.toString().toLowerCase();
    if (type === '0' || type === 'percent') return `${coupon.value}% de desconto`;
    if (type === '1' || type === 'fixed') return `${formatPrice(coupon.value)} de desconto`;
    if (type === '2' || type === 'freeshipping') return 'Frete grátis';
    return '';
};

export const CouponInput: React.FC<CouponInputProps> = ({ className = '' }) => {
    const [couponCode, setCouponCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);

    const { appliedCoupon, applyCoupon, removeCoupon } = useCart();

    const validateCoupon = async (code: string) => {
        try {
            const response = await validateCouponRequest(code);

            if (response.coupon == null) {
                setCouponError(response.message);
                return null;
            }

            const coupon = response.coupon;

            if (!coupon.isActive) {
                setCouponError("Cupom não está ativo.");
                return null;
            }

            if (coupon.usedCount >= coupon.usageLimit) {
                setCouponError("Cupom esgotado.");
                return null;
            }

            setCouponError(null);
            return coupon;
        } catch (error) {
            const errorMessage = error instanceof AxiosError ? error.response?.data?.message : null;
            setCouponError(errorMessage || 'Não foi possível validar o cupom. Tente de novo.');
            return null;
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setIsApplying(true);
        setCouponError(null);

        const validatedCoupon = await validateCoupon(couponCode.trim().toUpperCase());

        if (validatedCoupon) {
            applyCoupon(validatedCoupon);
            setCouponCode('');
        }

        setIsApplying(false);
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode('');
        setCouponError(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyCoupon();
        }
    };

    if (appliedCoupon) {
        return (
            <div className={`flex items-center justify-between gap-3 rounded-md border border-green-300 bg-green-50 px-3 py-2.5 ${className}`}>
                <div className="flex items-center gap-2.5">
                    <Check className="size-4 shrink-0 text-green-700" />
                    <div>
                        <p className="text-sm font-semibold text-green-900">
                            Cupom {appliedCoupon.code}
                        </p>
                        <p className="text-sm text-green-800">
                            {describeCoupon(appliedCoupon)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleRemoveCoupon}
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-green-800 hover:bg-green-100"
                    aria-label="Remover cupom"
                >
                    <X className="size-4" />
                </button>
            </div>
        );
    }

    return (
        <div className={className}>
            <label htmlFor="coupon" className="mb-1.5 block text-sm font-medium text-slate-700">
                Cupom de desconto
            </label>
            <div className="flex items-center gap-2">
                <input
                    id="coupon"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite o código"
                    aria-invalid={!!couponError}
                    aria-describedby={couponError ? 'coupon-error' : undefined}
                    className={`h-10 w-full min-w-0 rounded-md border bg-white px-3 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 sm:text-sm ${couponError ? 'border-red-500' : 'border-slate-300'}`}
                    disabled={isApplying}
                />
                <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || isApplying}
                    className="h-10 shrink-0"
                >
                    {isApplying && <Loader2 className="size-4 animate-spin" />}
                    {isApplying ? 'Aplicando' : 'Aplicar'}
                </Button>
            </div>

            {couponError && (
                <p id="coupon-error" role="alert" className="mt-1.5 text-sm text-red-700">
                    {couponError}
                </p>
            )}
        </div>
    );
};
