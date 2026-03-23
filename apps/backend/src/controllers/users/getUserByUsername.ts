import { Request, Response } from 'express';
import { getUserByUsernameService } from '../../services/userService';

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const result = await getUserByUsernameService(username);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(404).json({ error: error.message || 'User not found.' });
  }
};