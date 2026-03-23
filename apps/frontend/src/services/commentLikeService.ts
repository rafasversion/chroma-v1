import { fetchApi } from './api';

export const toggleCommentLikeService = async (comment_id: number) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ liked: boolean; total_likes: number }>(`/api/comment-like/${comment_id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};