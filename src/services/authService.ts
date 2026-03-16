import { fecthApi } from './api.ts';
import type { LoginResponse } from '../types/loginResponse.ts';
import type { ValidateResponse } from '../types/validateResponse.ts';

const URL = "http://chroma-api.test/json/jwt-auth/v1";

export const authService = async (options: RequestInit) => {
  const data = await fecthApi<LoginResponse>(`${URL}/token`, options);
  if (!data) return;
  return data;
}

export const tokenValidate = async (token: string) => {

  const data = await fecthApi<LoginResponse>(`${URL}/token/validate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return !!data;
}