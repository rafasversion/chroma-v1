import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { generateToken } from '../middleware/auth';

export const registerService = async (email: string, username: string, password: string) => {
  const existingUser = await prisma.users.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existingUser) throw new Error('Email or username already registered.');

  const password_hash = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: { username, email, password_hash, user_picture: '' },
  });

  const token = generateToken(user.id, user.email);
  return { id: user.id, username: user.username, email: user.email, token };
};

export const loginService = async (login: string, password: string) => {
  const user = await prisma.users.findFirst({
    where: { OR: [{ email: login }, { username: login }] },
  });

  if (!user) throw new Error('Incorrect email address/username or password.');

  const isPasswordValid = await bcrypt.compare(password, user.password_hash || '');
  if (!isPasswordValid) throw new Error('Incorrect email address/username or password.');

  const token = generateToken(user.id, user.email);
  return { id: user.id, username: user.username, email: user.email, token };
};

export const googleLoginService = async (
  token: string,
  email: string,
  username?: string,
  picture?: string,
) => {
  let user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.users.create({
      data: {
        email,
        username: username || email.split('@')[0],
        password_hash: '',
        user_picture: picture || '',
        is_google_user: true,
      },
    });
  } else if (!user.is_google_user) {
    throw new Error('Email already registered.');
  }

  const jwtToken = generateToken(user.id, user.email);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    token: jwtToken,
    user_picture: user.user_picture,
  };
};