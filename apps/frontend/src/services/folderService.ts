import { fetchApi } from './api';
import type { FolderAPI } from '../types/folderApi';

export const folderService = async <T = FolderAPI[]>(options?: RequestInit) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<T>('/api/folder', {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.headers as Record<string, string>),
    },
  });
};

export const getFolderByIdService = async (id: string | number) => {
  return await fetchApi<FolderAPI>(`/api/folder/${id}`);
};

export const createFolderService = async (formData: FormData) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<FolderAPI>('/api/folder', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
};

export const updateFolderService = async (id: number, formData: FormData) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ message: string }>(`/api/folder/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
};