import { Response } from 'express';
import { AuthRequest } from '../../types';
import { createFolderService } from '../../services/folderService';

export const createFolder = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: 'User not logged in.' });

    const title = req.body.title;
    if (!title) return res.status(422).json({ error: 'The folder title is required..' });

    const description = req.body.description;
    const is_private = req.body.is_private === '1' || req.body.is_private === 'true' || req.body.is_private === true;

    const backendUrl = process.env.BACKEND_URL;

    const cover_url = req.file
      ? `${backendUrl}/uploads/${req.file.filename}`
      : undefined;

    const result = await createFolderService(user_id, title, description, is_private, cover_url);
    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error creating folder.' });
  }
};