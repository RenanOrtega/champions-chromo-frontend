export const WHATSAPP_NUMBER = "5511973719123";

export const whatsAppUrl = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
