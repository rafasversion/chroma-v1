import { fecthApi } from './api';
import type { PhotoAPI } from '../types/photoApi';

export const userPostsService = async (username: string, page: number = 1, total: number = 21) => {
  const token = window.localStorage.getItem("token");

  const url = `http://chroma-api.test/json/api/photo?_user=${username}&_page=${page}&_total=${total}`;

  const options: RequestInit = {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  const data = await fecthApi<PhotoAPI[]>(url, options);

  return data || [];
};