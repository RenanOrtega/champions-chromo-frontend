import { getPaymentConfig } from "@/clients/payment";
import { PaymentMode } from "@/types/payment";
import { useEffect, useState } from "react";

let cached: Promise<PaymentMode> | null = null;

// The backend decides the checkout (feature toggle Payments__Mode); asked once per page load.
export const usePaymentMode = () => {
    const [mode, setMode] = useState<PaymentMode | null>(null);

    useEffect(() => {
        cached ??= getPaymentConfig().then(config => config.mode);
        let active = true;
        cached.then(value => { if (active) setMode(value); });
        return () => { active = false; };
    }, []);

    return { mode, loading: mode === null };
};
