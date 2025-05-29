export interface Coupon {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    usageLimit: number;
    usedCount: number;
    expiresAt: string;
    minPurchaseValue: number;
    isActive: boolean;
}

export enum CouponType {
    Percent = 0,
    Fixed = 1,
    FreeShipping = 2
}

export interface CouponState {
    coupon: Coupon | null;
    loading: boolean;
    error: string | null;
}

export interface CouponValidateResponse {
    coupon: Coupon | null;
    message: string;
}