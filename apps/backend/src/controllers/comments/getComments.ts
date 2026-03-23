import { Request, Response } from 'express';
import { getCommentsService } from '../../services/commentService';

export const getComments = async (req: Request, res: Response) => {
  try {
    const post_id = parseInt(req.params.id);

    const result = await getCommentsService(post_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error retrieving comments.' });
  }
};