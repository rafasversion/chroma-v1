import { Request, Response } from 'express';
import { getPostService } from '../../services/postService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const getPost = async (req: Request, res: Response) => {
  try {
    const post_id = parseInt(req.params.id);
    if (!post_id) return res.status(404).json({ error: 'Post not found.' });

    let requesting_user_id: number | undefined;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        requesting_user_id = decoded.id;
      } catch { }
    }

    const result = await getPostService(post_id, requesting_user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(404).json({ error: error.message || 'Post not found.' });
  }
};