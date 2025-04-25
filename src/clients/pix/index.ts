import { Address, CreateOrder, GeneratePixQrCode, PixQrCodeResponse, PixStatus } from "../../types";
import { apiRequest as abacatePayRequest } from "../AbacatePayClient";
import { apiRequest } from "../ApiClient";

const convertToCents = (amount: number) => {
    return Math.floor(amount * 100);
}

export const createQrCodePix = async (generatePixQrCode: GeneratePixQrCode, address: Address): Promise<PixQrCodeResponse> => {
    const pixQrCodeResponse = await abacatePayRequest<PixQrCodeResponse>('/pixQrCode/create', 'POST', {...generatePixQrCode, amount: convertToCents(generatePixQrCode.amount)});
    if (pixQrCodeResponse.data) {
        const createOrderRequest: CreateOrder = {
            integrationId: pixQrCodeResponse.data.id,
            payment: {
                amount: convertToCents(generatePixQrCode.amount),
                fee: pixQrCodeResponse.data.platformFee || 0,
            },
            address: address,
            customer: generatePixQrCode.customer,
            status: 'PENDING'
        }
       await createOrder(createOrderRequest);
    }
    return pixQrCodeResponse;
}

export const createOrder = async (createOrder: CreateOrder): Promise<void> => {
    return await apiRequest('/pix/order', 'POST', createOrder);
}

export const checkStatus = async (pixId: string): Promise<PixStatus> => {
    return await apiRequest(`/pix/order/status?integrationId=${pixId}`, 'GET');
}

export const simulatePayment = async (pixId: string, status: 'PENDING' | 'PAID' | 'CANCELED'): Promise<void> => {
    return await apiRequest('/pix/webhook?webhookSecret=champ_chrom_kVjasmdAfl99', 'POST', { pixQrCode: { id: pixId, status } })
}