// import { useState } from "react";
// import { Address, CreateOrder, Customer, GeneratePixQrCode, PixQrCodeResponse } from "../types";
// import { createOrder, createQrCodePix } from "../clients/pix";

// interface UsePaymentReturn {
//   isLoading: boolean;
//   error: string | null;
//   pixData: PixQrCodeResponse['data'];
//   generatePix: (data: PaymentData) => Promise<void>;
//   finalizeOrder: (integrationId: string, paymentData: PaymentData) => Promise<void>;
// }

// interface PaymentData {
//   amount: number;
//   customer: Customer;
//   address: Address;
// }

// export const usePayment = (): UsePaymentReturn => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pixData, setPixData] = useState<PixQrCodeResponse['data']>(null);

//   const generatePix = async (data: PaymentData): Promise<void> => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const pixRequest: GeneratePixQrCode = {
//         amount: convertToCents(data.amount),
//         expiresIn: 3600,
//         description: `Pedido de figurinhas - ${new Date().toISOString()}`,
//         customer: data.customer
//       };

//       const response = await createQrCodePix(pixRequest);

//       if (response.error) {
//         setError(response.error);
//         return;
//       }

//       setPixData(response.data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Erro ao gerar PIX.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const finalizeOrder = async (integrationId: string, paymentData: PaymentData): Promise<void> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const orderData: CreateOrder = {
//         integrationId,
//         payment: {
//           amount: convertToCents(paymentData.amount),
//           fee: pixData?.platformFee || 0,
//         },
//         address: paymentData.address,
//         customer: paymentData.customer,
//         status: 'PENDING'
//       };

//       await createOrder(orderData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Erro ao finalizar o pedido');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const convertToCents = (amount: number) => {
//     return Math.floor(amount * 100);
//   }

//   return {
//     isLoading,
//     error,
//     pixData,
//     generatePix,
//     finalizeOrder,
//   };
// }