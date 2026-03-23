import { fetchApi } from './api';
import type { PostAPI } from '../types/postApi';

export const userPostsService = async (username: string, page = 1, total = 21): Promise<PostAPI[]> => {
  const token = window.localStorage.getItem('token');
  const data = await fetchApi<PostAPI[]>(
    `/api/photo?_user=${username}&_page=${page}&_total=${total}`,
    { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } },
  );
  return data || [];
};