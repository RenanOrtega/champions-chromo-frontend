import axios, { AxiosResponse } from "axios";

const abacatePayClient = axios.create({
  baseURL: import.meta.env.ABACATE_PAY_BASE_URL,  // Usar a rota do proxy local
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.ABACATE_PAY_TOKEN_DEV}`
  },
});

export const apiRequest = async <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> => {
  const response: AxiosResponse<T> = await abacatePayClient({
    method,
    url,
    data,
  });
  console.log(response);
  return response.data;
}