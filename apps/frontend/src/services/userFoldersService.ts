import { fetchApi } from './api';
import type { FolderAPI } from '../types/folderApi';

export const userFoldersService = async (username?: string): Promise<FolderAPI[]> => {
  const token = window.localStorage.getItem('token');
  const url = username ? `/api/users/${username}/folders` : `/api/folder`;
  const data = await fetchApi<FolderAPI[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data || [];
};