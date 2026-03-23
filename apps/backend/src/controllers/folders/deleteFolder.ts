import { Response } from 'express';
import { AuthRequest } from '../../types';
import { deleteFolderService } from '../../services/folderService';

export const deleteFolder = async (req: AuthRequest, res: Response) => {
  try {
    const folder_id = parseInt(req.params.id);
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: 'No permission.' });
    }

    const result = await deleteFolderService(folder_id, user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(403).json({ error: error.message || 'Error deleting folder.' });
  }
};