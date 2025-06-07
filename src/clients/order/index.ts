import { CreateOrderSummaryResponse, OrderSummary } from "@/types/order";
import { apiRequest } from "../ApiClient";

export const createOrder = async (order: OrderSummary): Promise<CreateOrderSummaryResponse> => {
    return await apiRequest<CreateOrderSummaryResponse>('/order', 'POST', order);
};

export const fetchOrders = async (): Promise<OrderSummary[]> => {
    return await apiRequest<OrderSummary[]>(`/order`, 'GET')
}

export const fetchOrderById = async (orderId: string): Promise<OrderSummary> => {
    return await apiRequest<OrderSummary>(`/order/${orderId}`, 'GET')
}