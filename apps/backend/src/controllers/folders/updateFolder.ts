import { Response } from 'express';
import { AuthRequest } from '../../types';
import { updateFolderService } from '../../services/folderService';

export const updateFolder = async (req: AuthRequest, res: Response) => {
  try {
    const folder_id = parseInt(req.params.id || req.body.id);
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: 'Sem permissão.' });

    const title = req.body.title;
    const description = req.body.description;
    const is_private = req.body.is_private === '1' || req.body.is_private === 'true' || req.body.is_private === true;
    const cover_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    const result = await updateFolderService(folder_id, user_id, title, description, is_private, cover_url);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error updating folder.' });
  }
};