import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { sendMail } from '../../utils/mailer';
import crypto from 'crypto';

export const passwordLost = async (req: Request, res: Response) => {
  try {
    const { login } = req.body;

    if (!login) {
      return res.status(400).json({ error: 'Email or username is required.' });
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });


    if (!user) {
      return res.json({ message: 'If the email address exists, you will receive the instructions.' });
    }

    if (user.is_google_user) {
      return res.status(400).json({ error: 'This account uses Google login.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expiry: resetExpiry,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/password-reset?key=${resetToken}&login=${user.username}`;

    await sendMail(
      user.email,
      'Reset your Chroma password',
      `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Reset your password</h2>
          <p>Hi <strong>${user.username}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to create a new one:</p>
          <a href="${resetUrl}" style="
            display: inline-block;
            margin: 24px 0;
            padding: 12px 24px;
            background: #1a1a1a;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
          ">Reset Password</a>
          <p style="color: #888; font-size: 0.85rem;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
    );

    return res.json({ message: 'If the email address exists, you will receive the instructions.' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Error processing request.' });
  }
};