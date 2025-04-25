import axios, { AxiosResponse } from "axios";

const apiClient = axios.create({
    baseURL: 'https://localhost:7133/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiRequest = async <T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient({
        method,
        url,
        data,
    });

    return response.data;
}