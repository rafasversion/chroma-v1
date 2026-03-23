import { fetchApi } from './api';
import type { PostCommentAPI } from '../types/postCommentApi';

export const commentService = async (post_id: string | number, options?: RequestInit) => {
  return await fetchApi<PostCommentAPI[]>(`/api/comment/${post_id}`, options);
};

export const createCommentService = async (
  post_id: string | number,
  comment: string,
  parentId?: number,
) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<PostCommentAPI>(`/api/comment/${post_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment, parentId }),
  });
};

export const deleteCommentService = async (comment_id: number) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ message: string }>(`/api/comment/${comment_id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};