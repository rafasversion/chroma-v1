import { Request, Response } from 'express';

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token, email, username, picture } = req.body;

    if (!token || !email) {
      return res.status(406).json({ error: 'Token and email are required.' });
    }

    const { googleLoginService } = await import('../../services/authService');
    const result = await googleLoginService(token, email, username, picture);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(403).json({ error: error.message || 'Error logging in with Google.' });
  }
};