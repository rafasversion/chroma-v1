import { fetchApi } from './api';
import type { PostAPI } from '../types/postApi';
import type { PostCommentAPI } from '../types/postCommentApi';

export interface PostParams {
  id?: string | number;
  _page?: number;
  _total?: number;
  _user?: number | string;
  _color?: string;
}

interface PostSingleResponse {
  post: PostAPI;
  comments: PostCommentAPI[];
}

export const postService = async (params: PostParams = {}, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };
  options.headers = headers;

  if (params.id) {
    return await fetchApi<PostSingleResponse>(`/api/photo/${params.id}`, options);
  }

  if (options.method === 'POST') {
    return await fetchApi<PostAPI>('/api/photo', options);
  }

  const page = params._page ?? 1;
  const total = params._total ?? 21;
  const user = params._user ?? 0;
  const color = params._color ? `&_color=${params._color}` : '';

  return await fetchApi<PostAPI[]>(`/api/photo?_page=${page}&_total=${total}&_user=${user}${color}`, options);
};