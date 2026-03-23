import { fetchApi } from './api';

export const removePostFromFolderService = async (post_id: number, folder_id: number) => {
  const token = window.localStorage.getItem('token');
  return await fetchApi<{ message: string; total_items: number }>('/api/folder/remove-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ post_id, folder_id }),
  });
};

