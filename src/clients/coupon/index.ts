import { CouponValidateResponse } from "@/types/coupon";
import { apiRequest } from "../ApiClient";

export const validateCouponRequest = async (code: string): Promise<CouponValidateResponse> => {
  return await apiRequest<CouponValidateResponse>(`/cupom/validate/${code}`, 'GET');
};