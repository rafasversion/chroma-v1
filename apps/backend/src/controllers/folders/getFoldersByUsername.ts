import { Request, Response } from 'express';
import { getFoldersByUsernameService } from '../../services/folderService';

export const getFoldersByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const result = await getFoldersByUsernameService(username);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(404).json({ error: error.message || 'User not found.' });
  }
};