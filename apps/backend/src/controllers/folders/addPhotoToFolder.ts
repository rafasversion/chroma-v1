import { Response } from 'express';
import { AuthRequest } from '../../types';
import { addPhotoToFolderService } from '../../services/folderService';

export const addPhotoToFolder = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    const { post_id, folder_id } = req.body;

    if (!user_id) return res.status(401).json({ error: 'User not logged in.' });
    if (!post_id || !folder_id) return res.status(400).json({ error: 'Invalid IDs.' });

    const result = await addPhotoToFolderService(Number(post_id), Number(folder_id), user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error saving post to folder.' });
  }
};