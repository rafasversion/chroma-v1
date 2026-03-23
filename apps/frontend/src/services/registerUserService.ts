import { fetchApi } from './api';

export const registerUserService = async (form: {
  username: string;
  email: string;
  password: string;
}) => {
  return await fetchApi<{ id: number; username: string; token: string }>('/api/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
};