import { PixPayment } from "@/types/payment";
import { apiRequest } from "../ApiClient";

export const createPixPayment = async (orderId: string): Promise<PixPayment> => {
    return await apiRequest<PixPayment>(`/payment/${orderId}/pix`, 'POST');
};

export const getPaymentStatus = async (orderId: string): Promise<PixPayment> => {
    return await apiRequest<PixPayment>(`/payment/${orderId}`, 'GET');
};
