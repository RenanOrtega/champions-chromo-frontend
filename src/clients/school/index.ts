import { School } from "../../types/school";
import { apiRequest } from "../ApiClient";

export const fetchSchools = async (): Promise<School[]> => {
    return await apiRequest<School[]>('/school', 'GET');
};