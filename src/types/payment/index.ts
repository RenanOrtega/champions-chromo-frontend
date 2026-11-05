export type PaymentStatus =
    | 'notStarted'
    | 'awaitingPayment'
    | 'paid'
    | 'expired'
    | 'cancelled'
    | 'refunded'

export interface PixPayment {
    orderId: string
    status: PaymentStatus
    amount: number
    qrCode?: string | null
    qrCodeBase64?: string | null
    ticketUrl?: string | null
    expiresAt?: string | null
    paidAt?: string | null
}
