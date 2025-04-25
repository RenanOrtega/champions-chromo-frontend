import { School } from "../../types";
import { apiRequest } from "../ApiClient";

export const fetchSchools = async (): Promise<School[]> => {
    return await apiRequest<School[]>('/school', 'GET');
};