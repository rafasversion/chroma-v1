import { fetchApi } from './api';

export const deleteFolderService = async (id: string | number) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ message: string }>(`/api/folder/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};