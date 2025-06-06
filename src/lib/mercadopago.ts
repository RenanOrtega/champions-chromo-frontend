import { initMercadoPago } from '@mercadopago/sdk-react';

// Configure com sua chave pública do MercadoPago
const MERCADOPAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

if (!MERCADOPAGO_PUBLIC_KEY) {
    throw new Error('MERCADOPAGO_PUBLIC_KEY is not defined');
}

// Inicializar MercadoPago
initMercadoPago(MERCADOPAGO_PUBLIC_KEY, {
    locale: 'pt-BR'
});

export { MERCADOPAGO_PUBLIC_KEY };