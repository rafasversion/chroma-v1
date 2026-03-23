import { fetchApi } from './api';

export const updatePostService = async (
  id: number,
  data: { title: string; description: string },
) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ message: string }>(`/api/photo/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};