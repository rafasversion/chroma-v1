import { Response } from 'express';
import { AuthRequest } from '../../types';
import { updateProfileService } from '../../services/userService';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: 'User does not have permission.' });
    }
    const backendUrl = process.env.BACKEND_URL
    const pictureUrl = req.file ? `${backendUrl}/uploads/${req.file.filename}` : undefined;

    const result = await updateProfileService(
      user_id,
      req.body.name,
      req.body.email,
      req.body.password,
      pictureUrl
    );

    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error updating user.' });
  }
};