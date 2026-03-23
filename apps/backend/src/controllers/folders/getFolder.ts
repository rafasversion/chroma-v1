import { Request, Response } from 'express';
import { getFolderService } from '../../services/folderService';

export const getFolder = async (req: Request, res: Response) => {
  try {
    const folder_id = parseInt(req.params.id);

    const result = await getFolderService(folder_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(404).json({ error: error.message || 'Folder not found.' });
  }
};