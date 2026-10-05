import { CreateOrderSummaryResponse, OrderSummary } from "@/types/order";
import { apiRequest } from "../ApiClient";

export const createOrder = async (order: OrderSummary): Promise<CreateOrderSummaryResponse> => {
    return await apiRequest<CreateOrderSummaryResponse>('/order', 'POST', order);
};