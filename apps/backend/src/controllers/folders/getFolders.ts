import { Response } from 'express';
import { AuthRequest } from '../../types';
import { getFoldersService } from '../../services/folderService';

export const getFolders = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: 'No permission.' });
    }

    const result = await getFoldersService(user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error searching for folders..' });
  }
};