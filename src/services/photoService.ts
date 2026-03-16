import { fecthApi } from './api.ts';
import type { PhotoAPI } from '../types/photoApi.ts';

export interface PhotoParams {
  id?: string | number;
  _page?: number;
  _total?: number;
  _user?: number | string;
  _color?: string;
}

interface PhotoSingleResponse {
  photo: PhotoAPI;
  comments: any[];
}

export const photoService = async (
  params: PhotoParams = {},
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  options.headers = headers;

  let url = `/json/api/photo`;

  if (params.id) {
    url += `/${params.id}`;
    return await fecthApi<PhotoSingleResponse>(url, options);
  }

  if (options.method !== "POST") {
    const page = params._page ?? 1;
    const total = params._total ?? 12;
    const user = params._user ?? 0;
    const color = params._color ? `&_color=${params._color}` : '';
    url += `?_page=${page}&_total=${total}&_user=${user}${color}`;
    return await fecthApi<PhotoAPI[]>(url, options);
  }

  return await fecthApi<PhotoAPI>(url, options);
};