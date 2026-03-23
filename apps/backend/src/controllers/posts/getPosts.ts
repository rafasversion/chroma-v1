import { Request, Response } from 'express';
import { getPostsService } from '../../services/postService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const _total = parseInt(req.query._total as string) || 21;
    const _page = parseInt(req.query._page as string) || 1;
    let _user = (req.query._user as string) || '0';
    const _color = (req.query._color as string) || null;

    if (isNaN(Number(_user)) && _user !== '0') {
      const { prisma } = await import('../../utils/prisma');
      const user = await prisma.users.findUnique({ where: { username: _user } });
      if (!user) return res.status(404).json({ error: 'User not found.' });
      _user = user.id.toString();
    }

    const user_id = _user && _user !== '0' ? parseInt(_user) : undefined;

    let requesting_user_id: number | undefined;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        requesting_user_id = decoded.id;
      } catch { }
    }

    const result = await getPostsService(user_id, _total, _page, _color || undefined, requesting_user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error when searching for posts.' });
  }
};