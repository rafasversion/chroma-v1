import { Response } from 'express';
import { AuthRequest } from '../../types';
import { prisma } from '../../utils/prisma';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'User does not have permission.' });
    }
    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      user_picture: user.user_picture,
      is_google_user: user.is_google_user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error when searching profile.' });
  }
};