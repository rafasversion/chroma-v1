import { Response } from 'express';
import { AuthRequest } from '../../types';
import { deleteCommentService } from '../../services/commentService';


export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment_id = parseInt(req.params.id);
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: 'No permission.' });
    }

    const result = await deleteCommentService(comment_id, user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(403).json({ error: error.message || 'Error deleting comment.' });
  }
};