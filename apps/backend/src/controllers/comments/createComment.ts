import { Request, Response } from 'express';
import { AuthRequest } from '../../types';
import { prisma } from '../../utils/prisma';
import { createCommentService } from '../../services/commentService';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    const post_id = parseInt(req.params.id);
    const { comment, parentId } = req.body;

    if (!user_id) {
      return res.status(401).json({ error: 'No permission.' });
    }

    if (!comment) {
      return res.status(422).json({ error: 'Incomplete data.' });
    }

    const result = await createCommentService(post_id, user_id, comment, parentId);
    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error creating comment.' });
  }
};