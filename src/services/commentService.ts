import { fecthApi } from './api.ts';
import type { PhotoCommentAPI } from '../types/photoCommentApi.ts';
export const commentService = async (id: string | number, options?: RequestInit) => {
  const url = `http://chroma-api.test/json/api/comment/${id}`;
  const data = await fecthApi<PhotoCommentAPI>(url, options);
  if (!data) return;
  return data;
}
