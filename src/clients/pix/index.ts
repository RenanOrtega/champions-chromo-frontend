import { CreateOrder, GeneratePixQrCode, PixQrCodeResponse } from "../../types";
import { apiRequest as abacatePayRequest } from "../AbacatePayClient";
import { apiRequest } from "../ApiClient";

export const createQrCodePix = async (generatePixQrCode: GeneratePixQrCode): Promise<PixQrCodeResponse> => {
    return await abacatePayRequest<PixQrCodeResponse>('/pixQrCode/create', 'POST', generatePixQrCode)
}

export const createOrder = async (createOrder: CreateOrder): Promise<void> => {
    return await apiRequest('/pix/order', 'POST', createOrder)
}