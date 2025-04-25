import { Album } from "../../types/album";
import { apiRequest } from "../ApiClient";

export const fetchAlbums = async (): Promise<Album[]> => {
  return await apiRequest<Album[]>('/album', 'GET');
};

export const fetchAlbumsBySchoolId = async (schoolId: string): Promise<Album[]> => {
  return await apiRequest<Album[]>(`/album/schoolId/${schoolId}`, 'GET')
}

export const fetchAlbumById = async (albumId: string): Promise<Album> => {
  return await apiRequest<Album>(`/album/${albumId}`, 'GET')
}