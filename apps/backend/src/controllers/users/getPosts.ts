import { Request, Response } from 'express';
import { getPostsByUsernameService } from '../../services/userService';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const _total = parseInt(req.query._total as string) || 21;
    const _page = parseInt(req.query._page as string) || 1;

    const result = await getPostsByUsernameService(username, _total, _page);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error when searching for posts.' });
  }
};