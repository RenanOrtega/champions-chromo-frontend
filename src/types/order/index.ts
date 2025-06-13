export interface OrderSummary {
    albums: AlbumOrder[]
    customer: Customer
    priceTotal: number
}

export type Customer = {
    name: string
    email: string
    address: CustomerAddress
}

export type CustomerAddress = {
    street: string
    number: string
    neighborhood: string
    postalCode: string
    complement: string
    city: string
    state: string
}

export interface AlbumOrder {
    albumId: string
    schoolId: string
    stickers: OrderStickers[]
}

export interface OrderStickers {
    type: 'common' | 'legend' | 'a4';
    number: string
    quantity: number
}

export interface CreateOrderSummaryResponse {
    id: string
}