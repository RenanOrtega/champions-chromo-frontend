export interface StickerItem {
  number: number;
  name: string;
}

export interface Sticker {
  id: string;
  albumId: string;
  number: number;
  name: string;
  type: 'common' | 'frame' | 'legend' | 'a4';
  price: number;
}

export interface CartItem {
  album: Album;
  stickers: Sticker[];
}

export interface Album {
  id: string;
  schoolId: string;
  name: string;
  price: number;
  releaseDate: string;
  coverImage: string;
  commonStickers: StickerItem[];
  frameStickers: StickerItem[];
  legendStickers: StickerItem[];
  a4Stickers: StickerItem[];
  totalStickers: number;
}

export interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
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

export interface GeneratePixQrCode {
  amount: number,
  expiresIn: number,
  description: string,
  customer: Customer,
}

export interface Customer {
  name: string,
  cellphone: string,
  email: string,
  taxId: string
}

export interface CreateOrder {
  integrationId: string,
  payment: Payment,
  address: Address,
  customer: Customer,
  status: string
}

export interface Payment {
  amount: number,
  fee: number,
}

export interface Address {
  zipCode: string,
  street: string,
  number: string,
  complement: string,
  neighborhood: string,
  city: string,
  state: string
}