export interface OrderSummary {
    albums: AlbumOrder[]
    priceTotal: number
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