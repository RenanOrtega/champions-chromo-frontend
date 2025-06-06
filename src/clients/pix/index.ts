import { CreateIntentPaymentRequest, CreateIntentPaymentResponse, CreateOrder, PaymentDetailsResponse, PixQrCodeResponse, PixStatus } from "../../types/pix";
import { apiRequest } from "../ApiClient";

export const createPixOrder = async (createOrder: CreateOrder): Promise<PixQrCodeResponse> => {
  return await apiRequest('/pix/order', 'POST', createOrder);
}

export const checkStatus = async (pixId: string): Promise<{ status: PixStatus }> => {
  return await apiRequest(`/pix/order/status?integrationId=${pixId}`, 'GET');
}

export const simulatePayment = async (pixId: string, status: 'PENDING' | 'PAID' | 'CANCELED'): Promise<void> => {
  return await apiRequest('/pix/webhook?webhookSecret=champ_chrom_kVjasmdAfl99', 'POST', { pixQrCode: { id: pixId, status } })
}

export const createPaymentIntentRequest = async (request: CreateIntentPaymentRequest): Promise<CreateIntentPaymentResponse> => {
  return await apiRequest('payment/create-payment-intent', 'POST', request);
}

export const getPaymentDetailsRequest = async (paymentIntentId: string): Promise<PaymentDetailsResponse> => {
  console.log(`não é possvel: ${paymentIntentId}`)
  return await apiRequest(`payment/${paymentIntentId}`, 'GET');
}