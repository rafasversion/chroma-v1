import { fetchApi } from './api';
import type { PostAPI } from '../types/postApi';

export const userLikesService = async (): Promise<PostAPI[]> => {
  const token = window.localStorage.getItem('token');
  const data = await fetchApi<PostAPI[]>('/api/user-likes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data || [];
};