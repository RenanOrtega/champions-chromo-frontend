import { PaymentConfig, PixPayment } from "@/types/payment";
import { apiRequest } from "../ApiClient";

export const createPixPayment = async (orderId: string): Promise<PixPayment> => {
    return await apiRequest<PixPayment>(`/payment/${orderId}/pix`, 'POST');
};

export const getPaymentStatus = async (orderId: string): Promise<PixPayment> => {
    return await apiRequest<PixPayment>(`/payment/${orderId}`, 'GET');
};

// Which checkout to show. Falls back to the manual (WhatsApp) flow if the API can't answer.
export const getPaymentConfig = async (): Promise<PaymentConfig> => {
    try {
        return await apiRequest<PaymentConfig>('/payment/config', 'GET');
    } catch {
        return { mode: 'manual' };
    }
};
