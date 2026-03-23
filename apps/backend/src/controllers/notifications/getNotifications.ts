import { Response } from 'express';
import { AuthRequest } from '../../types';
import { getNotificationsService } from '../../services/notificationService';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: 'No permission.' });
    }

    const result = await getNotificationsService(user_id);
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error fetching notifications.' });
  }
};