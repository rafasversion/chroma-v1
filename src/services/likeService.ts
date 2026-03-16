import { fecthApi } from './api.ts';
import type { LikeResponse } from '../types/likeResponse.ts';
export const likeService = async (id: string | number, options?: RequestInit) => {
  const url = `http://chroma-api.test/json/api/like/${id}`;
  const data = await fecthApi<LikeResponse>(url, options);
  if (!data) return;
  return data;
}
