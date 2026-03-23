import { fetchApi } from './api';
import type { UserAPI } from '../types/userApi';

export const userByUsernameService = async (username: string) => {
  return await fetchApi<UserAPI>(`/api/user/by-username/${username}`);
};