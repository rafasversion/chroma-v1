import { fecthApi } from './api';
import type { FolderAPI } from '../types/folderApi';

export const userFoldersService = async (username?: string) => {
  const token = window.localStorage.getItem("token");

  const url = username
    ? `http://chroma-api.test/json/api/users/${username}/pasta`
    : `http://chroma-api.test/json/api/pasta`;

  const data = await fecthApi<FolderAPI[]>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data || [];
};