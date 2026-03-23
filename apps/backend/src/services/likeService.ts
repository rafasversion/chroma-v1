import { prisma } from '../utils/prisma';
import { createNotification } from './notificationService';

export const toggleLikeService = async (post_id: number, user_id: number) => {
  const post = await prisma.posts.findUnique({
    where: { id: post_id },
  });

  if (!post) {
    throw new Error('Post not found.');
  }

  const existingLike = await prisma.likes.findUnique({
    where: {
      user_id_post_id: {
        user_id,
        post_id,
      },
    },
  });

  let message: string;
  if (existingLike) {
    await prisma.likes.delete({
      where: {
        user_id_post_id: {
          user_id,
          post_id,
        },
      },
    });
    message = 'Like removed.';
  } else {
    await prisma.likes.create({
      data: {
        user_id,
        post_id,
      },
    });
    message = 'Like added.';

    if (post.user_id !== user_id) {
      await createNotification(post.user_id, user_id, post_id, 'like');
    }
  }

  const totalLikes = await prisma.likes.count({
    where: { post_id },
  });

  return {
    message,
    count: totalLikes,
    user_id,
  };
};

export const getUserLikesService = async (user_id: number) => {
  const likedPosts = await prisma.likes.findMany({
    where: { user_id },
    include: {
      posts: {
        include: {
          users: true,
          likes: true,
          comments: true,
        },
      },
    },
  });

  return likedPosts.map((like: any) => ({
    id: like.posts.id,
    author: like.posts.users.username,
    title: like.posts.title,
    date: like.posts.created_at?.toISOString(),
    file_url: like.posts.file_url,
    is_video: like.posts.is_video,
    content: like.posts.description,
    acessos: like.posts.access_count || 0,
    total_comments: like.posts.comments.length,
    total_likes: like.posts.likes.length,
    user_liked: true,
    dominant_color: like.posts.dominant_color,
  }));
};