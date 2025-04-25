import axios, { AxiosResponse } from "axios";

const abacatePayClient = axios.create({
    baseURL: '/api/abacatepay',  // Usar a rota do proxy local
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer abc_dev_0mSfmTQXHsNfYKj5jFPT6T55`
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