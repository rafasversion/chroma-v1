import { Response } from 'express';
import { AuthRequest } from '../../types';
import { toggleCommentLikeService } from '../../services/commentService';

export const toggleCommentLike = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    const comment_id = parseInt(req.params.id);
    if (!user_id) return res.status(401).json({ error: 'No permission.' });

    const result = await toggleCommentLikeService(comment_id, user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error processing like.' });
  }
};