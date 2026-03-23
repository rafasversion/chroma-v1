import { Response } from 'express';
import { AuthRequest } from '../../types';
import { toggleLikeService } from '../../services/likeService';

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    const post_id = parseInt(req.params.id);

    if (!user_id) {
      return res.status(401).json({ error: 'User does not have permission.' });
    }

    const result = await toggleLikeService(post_id, user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error processing like.' });
  }
};