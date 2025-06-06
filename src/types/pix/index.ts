import { Address, Customer, Payment } from ".."
import { CartItem } from "../cart"

export interface GeneratePixQrCode {
  amount: number,
  expiresIn: number,
  description: string,
  customer: Customer,
}

export interface PixQrCodeResponse {
  data: PixQrCodeResponseData | null,
  error: string | null
}

export interface PixQrCodeResponseData {
  id: string,
  amount: number,
  status: string,
  devMode: boolean,
  brCode: string,
  brCodeBase64: string,
  platformFee: number,
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date
}

export interface CreateOrder {
  payment: Payment,
  address: Address,
  customer: Customer,
  expiresIn: number,
  description: string
}

export interface CreateIntentPaymentRequest {
  amount: number,
  currency: string,
  items: CartItem[]
}

export interface CreateIntentPaymentResponse {
  clientSecret: string
}

export interface PaymentDetailsResponse {
  id: string
  amount: number
}

export type PixStatus = "PENDING" | "PAID" | "CANCELED";