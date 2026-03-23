import { fetchApi } from './api';
import type { UserAPI } from '../types/userApi';

export const userService = async (): Promise<UserAPI | null> => {
  const token = window.localStorage.getItem('token');
  if (!token) return null;
  return await fetchApi<UserAPI>('/api/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
};