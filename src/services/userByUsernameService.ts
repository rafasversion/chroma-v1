import { fecthApi } from './api';

interface UserData {
  id: number;
  username: string;
  nome: string;
  email: string;
}

export const userByUsernameService = async (username: string) => {
  const url = `http://chroma-api.test/json/api/user/by-username/${username}`;
  const data = await fecthApi<UserData>(url);
  return data;
};