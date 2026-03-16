import { fecthApi } from './api.ts';
import type { FolderAPI } from '../types/folderApi.ts';

export const folderService = async <T = FolderAPI>(
  options?: RequestInit,
  endpoint: string = 'pasta'
) => {
  const url = `http://chroma-api.test/json/api/${endpoint}`;
  const data = await fecthApi<T>(url, options);
  return data;
}

export const getFolderByIdService = async (id: string) => {
  const token = window.localStorage.getItem("token");
  const url = `http://chroma-api.test/json/api/pasta/${id}`;

  const data = await fecthApi<FolderAPI>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};