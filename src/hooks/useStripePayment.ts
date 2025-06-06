// src/hooks/useStripePayment.ts
import { createPaymentIntentRequest } from '@/clients/pix';
import { CartItem } from '@/context/CartContext';
import { useState } from 'react';

interface PaymentData {
    amount: number;
    currency?: string;
    items: CartItem[];
}

interface UseStripePaymentReturn {
    createPaymentIntent: (data: PaymentData) => Promise<string | null>;
    loading: boolean;
    error: string | null;
}

export const useStripePayment = (): UseStripePaymentReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPaymentIntent = async (data: PaymentData): Promise<string | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await createPaymentIntentRequest({
                amount: Math.round(data.amount * 100),
                currency: data.currency || 'brl',
                items: data.items
            });

            return response.clientSecret;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createPaymentIntent,
        loading,
        error,
    };
};