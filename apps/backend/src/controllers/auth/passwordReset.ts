import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import bcrypt from 'bcryptjs';

export const passwordReset = async (req: Request, res: Response) => {
  try {
    const { login, key, password } = req.body;

    if (!login || !key || !password) {
      return res.status(400).json({ error: 'Incomplete data.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'The password must be at least 6 characters long.' });
    }

    const user = await prisma.users.findFirst({
      where: { username: login },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired link.' });
    }

    if (
      !user.reset_token ||
      user.reset_token !== key ||
      !user.reset_token_expiry ||
      new Date() > user.reset_token_expiry
    ) {
      return res.status(400).json({ error: 'Invalid or expired link..' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        password_hash,
        reset_token: null,
        reset_token_expiry: null,
      },
    });

    return res.json({ message: 'Password reset successfully!' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Error resetting password.' });
  }
};