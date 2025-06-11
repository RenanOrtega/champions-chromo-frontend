import { School } from "../../types/school";
import { apiRequest } from "../ApiClient";

export const fetchSchools = async (): Promise<School[]> => {
    return await apiRequest<School[]>('/school', 'GET');
};

export const fetchSchoolById = async (id: string): Promise<School> => {
    return await apiRequest<School>(`/school/${id}`, 'GET');
}