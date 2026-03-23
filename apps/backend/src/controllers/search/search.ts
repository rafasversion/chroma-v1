import { Request, Response } from 'express';
import { searchService } from '../../services/searchService';

export const search = async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';

    const result = await searchService(query);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(422).json({ error: error.message || 'Search error.' });
  }
};