
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';

export const getProfileService = async (user_id: number) => {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name || user.username,
    email: user.email,
    user_picture: user.user_picture,
    is_google_user: user.is_google_user,
  };
};

export const getUserByUsernameService = async (username: string) => {
  const user = await prisma.users.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name || user.username,
    email: user.email,
    user_picture: user.user_picture,
  };
};

export const updateProfileService = async (
  user_id: number,
  name?: string,
  email?: string,
  password?: string,
  pictureUrl?: string
) => {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  const userData: any = {};
  const updatedFields: any = {};

  if (name) {
    userData.name = name;
    updatedFields.name = name;
  }

  if (email && email !== user.email) {
    const existingEmail = await prisma.users.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new Error('This email address is already in use.');
    }

    userData.email = email;
    updatedFields.email = email;
  }

  if (password) {
    if (password.length < 6) {
      throw new Error('The password must be at least 6 characters long.');
    }

    userData.password_hash = await bcrypt.hash(password, 10);
    updatedFields.password = true;
  }

  if (pictureUrl) {
    userData.user_picture = pictureUrl;
    updatedFields.user_picture = pictureUrl;
  }

  if (Object.keys(userData).length === 0) {
    return {
      message: 'Nothing to update.',
    };
  }

  const updatedUser = await prisma.users.update({
    where: { id: user_id },
    data: userData,
  });

  return {
    message: 'User updated successfully.',
    id: updatedUser.id,
    username: updatedUser.username,
    name: updatedUser.name,
    email: updatedUser.email,
    user_picture: updatedUser.user_picture,
    updated: updatedFields,
  };
};

export const getPostsByUsernameService = async (username: string, total: number, page: number) => {
  const user = await prisma.users.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  const posts = await prisma.posts.findMany({
    where: { user_id: user.id },
    include: {
      users: true,
      likes: true,
      comments: true,
    },
    orderBy: { created_at: 'desc' },
    skip: (page - 1) * total,
    take: total,
  });

  return posts.map((post: any) => ({
    id: post.id,
    author: post.users.username,
    title: post.title,
    date: post.created_at?.toISOString(),
    file_url: post.file_url,
    is_video: post.is_video,
    content: post.description,
    access_number: post.access_count || 0,
    total_comments: post.comments.length,
    total_likes: post.likes.length,
    user_liked: false,
    dominant_color: post.dominant_color,
  }));
};

export const deleteProfileService = async (user_id: number) => {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  await prisma.posts.deleteMany({
    where: { user_id },
  });

  await prisma.comments.deleteMany({
    where: { user_id },
  });

  await prisma.likes.deleteMany({
    where: { user_id },
  });

  await prisma.folders.deleteMany({
    where: { user_id },
  });

  await prisma.notifications.deleteMany({
    where: {
      OR: [
        { user_id },
        { from_user_id: user_id },
      ],
    },
  });

  await prisma.users.delete({
    where: { id: user_id },
  });

  return { message: 'Profile successfully deleted.' };
};