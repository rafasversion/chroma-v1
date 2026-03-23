import { Response } from 'express';
import { AuthRequest } from '../../types';
import { updatePostService } from '../../services/postService';

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const post_id = parseInt(req.params.id);
    const user_id = req.user?.id;
    const titulo = req.body.title || req.body.titulo;
    const descricao = req.body.description || req.body.descricao;

    if (!user_id) {
      return res.status(401).json({ error: 'No permission.' });
    }

    const result = await updatePostService(post_id, user_id, titulo, descricao);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error updating post.' });
  }
};