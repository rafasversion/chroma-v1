import { prisma } from '../utils/prisma';
import { createNotification } from './notificationService';

export const getCommentsService = async (post_id: number) => {
  const comments = await prisma.comments.findMany({
    where: { post_id, parent_id: null },
    include: {
      users: {
        select: {
          id: true,
          username: true,
          user_picture: true,
        },
      },
      other_comments: {
        include: {
          users: {
            select: {
              id: true,
              username: true,
              user_picture: true,
            },
          },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return comments.map((comment: any) => ({
    comment_id: comment.id,
    comment_author: comment.users.username,
    comment_content: comment.content,
    comment_date: comment.created_at?.toISOString(),
    user_id: comment.user_id,
    user_picture: comment.users.user_picture || '',
    replies: comment.other_comments.map((reply: any) => ({
      comment_id: reply.id,
      comment_author: reply.users.username,
      comment_content: reply.content,
      comment_date: reply.created_at?.toISOString(),
      user_id: reply.user_id,
      user_picture: reply.users.user_picture || '',
    })),
  }));
};

export const createCommentService = async (
  post_id: number,
  user_id: number,
  comment: string,
  parentId?: number
) => {
  if (!comment) {
    throw new Error('Dados incompletos.');
  }

  const newComment = await prisma.comments.create({
    data: {
      post_id,
      user_id,
      content: comment,
      parent_id: parentId || null,
    },
    include: {
      users: {
        select: {
          username: true,
          user_picture: true,
        },
      },
    },
  });

  const post = await prisma.posts.findUnique({
    where: { id: post_id },
    select: { user_id: true },
  });

  if (post && post.user_id !== user_id) {
    await createNotification(post.user_id, user_id, post_id, 'comment');
  }

  return {
    id: newComment.id,
    content: newComment.content,
    author: newComment.users.username,
    date: newComment.created_at,
  };
};

export const deleteCommentService = async (comment_id: number, user_id: number) => {
  const comment = await prisma.comments.findUnique({
    where: { id: comment_id },
  });

  if (!comment || comment.user_id !== user_id) {
    throw new Error('No permission or comment found.');
  }

  await prisma.comments.delete({
    where: { id: comment_id },
  });

  return { message: 'Comentário removido.' };
};

export const toggleCommentLikeService = async (comment_id: number, user_id: number) => {
  const comment = await prisma.comments.findUnique({ where: { id: comment_id } });
  if (!comment) throw new Error('Comment not found.');

  const existing = await prisma.comment_likes.findUnique({
    where: { user_id_comment_id: { user_id, comment_id } },
  });

  if (existing) {
    await prisma.comment_likes.delete({
      where: { user_id_comment_id: { user_id, comment_id } },
    });
  } else {
    await prisma.comment_likes.create({ data: { user_id, comment_id } });

    if (comment.user_id !== user_id) {
      await createNotification(comment.user_id, user_id, comment.post_id, 'comment_like');
    }
  }

  const total_likes = await prisma.comment_likes.count({ where: { comment_id } });
  return { liked: !existing, total_likes };
};