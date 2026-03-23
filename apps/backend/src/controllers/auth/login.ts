import { Request, Response } from 'express';
import { loginService } from '../../services/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, username, login, password } = req.body;
    const loginField = login || email || username;

    if (!loginField || !password) {
      return res.status(406).json({ error: 'Login and password are required.' });
    }

    const result = await loginService(loginField, password);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({ error: error.message || 'Error logging in.' });
  }
};