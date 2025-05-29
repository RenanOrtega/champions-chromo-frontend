import { useState } from 'react';
import { Check, X, Ticket, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useCart } from '@/context/CartContext';
import { validateCouponRequest } from '@/clients/coupon';

interface CouponInputProps {
    className?: string;
}

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
            const errorMessage = error instanceof AxiosError ? error.response?.data?.message : 'Erro desconhecido.';
            setCouponError(errorMessage);
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyCoupon();
        }
    };

    if (appliedCoupon) {
        return (
            <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-800">
                                Cupom aplicado: {appliedCoupon.code}
                            </p>
                            <p className="text-xs text-green-600">
                                {appliedCoupon.type === 0 && `${appliedCoupon.value}% de desconto`}
                                {appliedCoupon.type === 1 && `R$ ${appliedCoupon.value.toFixed(2)} de desconto`}
                                {appliedCoupon.type === 2 && 'Frete grátis'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemoveCoupon}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-green-100 text-green-600 hover:text-green-800"
                        title="Remover cupom"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Ticket className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite seu cupom"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        disabled={isApplying}
                    />
                </div>
                <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || isApplying}
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    {isApplying ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Aplicando</span>
                        </>
                    ) : (
                        <span>Aplicar</span>
                    )}
                </button>
            </div>

            {couponError && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <X className="h-4 w-4" />
                    <span>{couponError}</span>
                </p>
            )}
        </div>
    );
};