import { fetchApi } from './api';
import type { LikeResponse } from '../types/likeResponse';
import type { PostAPI } from '../types/postApi';

export const likeService = async (post_id: string | number) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<LikeResponse>(`/api/like/${post_id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserLikesService = async () => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<PostAPI[]>('/api/user-likes', {
    headers: { Authorization: `Bearer ${token}` },
  });
};