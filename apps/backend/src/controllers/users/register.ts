import { Request, Response } from 'express';
import { registerService } from '../../services/authService';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(406).json({ error: 'Incomplete data.' });
    }

    const result = await registerService(email, username, password);
    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(403).json({ error: error.message || 'Error creating user.' });
  }
};