import { fetchApi } from './api';

export const addPostToFolderService = async (post_id: number, folder_id: number) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ message: string; total_items: number }>('/api/folder/add-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ post_id, folder_id }),
  });
};