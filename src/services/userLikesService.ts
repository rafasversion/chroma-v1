import { fecthApi } from './api';
import type { PhotoAPI } from '../types/photoApi';

export const userLikesService = async () => {
  const token = window.localStorage.getItem("token");
  const url = `http://chroma-api.test/json/api/user-likes`;
  const data = await fecthApi<PhotoAPI[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data || [];
};