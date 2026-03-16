import { fecthApi } from './api.ts';
import type { UserAPI } from '../types/userApi.ts';

export const userService = async (options?: RequestInit) => {
  const token = window.localStorage.getItem("token");
  const url = `http://chroma-api.test/json/api/user`;

  const headers: any = {
    ...options?.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const data = await fecthApi<UserAPI>(url, {
    ...options,
    headers,
  });

  if (!data) return;
  return data;
}