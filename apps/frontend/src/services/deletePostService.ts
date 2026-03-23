import { fetchApi } from './api';

export const deletePostService = async (id: string | number) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ message: string }>(`/api/photo/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};