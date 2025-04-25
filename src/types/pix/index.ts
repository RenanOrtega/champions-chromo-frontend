import { Address, Customer, Payment } from ".."

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

export type PixStatus = "PENDING" | "PAID" | "CANCELED";