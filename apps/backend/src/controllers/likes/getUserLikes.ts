import { Response } from 'express';
import { AuthRequest } from '../../types';
import { getUserLikesService } from '../../services/likeService';

export const getUserLikes = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: 'User does not have permission.' });
    }

    const result = await getUserLikesService(user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error retrieving likes.' });
  }
};