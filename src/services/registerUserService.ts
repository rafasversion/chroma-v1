import { fecthApi } from './api.ts';

export const registerUserService = async (form: {
  username: string;
  email: string;
  password: string;
}) => {
  const url = `http://chroma-api.test/json/api/user/register`;

  const data = await fecthApi<any>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });

  return data;
}