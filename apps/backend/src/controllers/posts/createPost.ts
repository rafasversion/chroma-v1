import { Request, Response } from 'express';
import { AuthRequest } from '../../types';
import { prisma } from '../../utils/prisma';
import { extractDominantColor } from '../../utils/colors';
import { createPostService } from '../../services/postService';

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: 'User does not have permission.' });
    }


    const title = req.body.title;
    const description = req.body.description;
    const file = req.file;

    if (!title || !description || !file) {
      return res.status(422).json({ error: 'Incomplete data.' });
    }

    const is_video = file.mimetype.startsWith('video/');
    const file_url = `/uploads/${file.filename}`;

    const result = await createPostService(
      user_id,
      title,
      description,
      file_url,
      is_video,
      file.path
    );

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error creating post.' });
  }
};