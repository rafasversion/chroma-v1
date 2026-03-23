import { prisma } from '../utils/prisma';

export const createNotification = async (
  user_id: number,
  from_user_id: number,
  post_id?: number,
  type: 'like' | 'comment' | 'reply' | 'comment_like' = 'like'
) => {
  if (user_id === from_user_id) return;

  if (type === 'like') {
    const existing = await prisma.notifications.findFirst({
      where: {
        user_id,
        from_user_id,
        post_id,
        type: 'like',
      },
    });

    if (existing) return;
  }

  const notification = await prisma.notifications.create({
    data: {
      user_id,
      from_user_id,
      post_id: post_id || null,
      type,
    },
  });

  return notification;
};

export const getNotificationsService = async (user_id: number) => {
  const notifications = await prisma.notifications.findMany({
    where: { user_id },
    include: {
      users_notifications_from_user_idTousers: {
        select: {
          username: true,
          user_picture: true,
        },
      },
      posts: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
    take: 30,
  });

  const unread = notifications.filter((n: any) => !n.is_read).length;

  const result = notifications.map((n: any) => ({
    id: n.id,
    type: n.type,
    from_user_id: n.from_user_id,
    from_user: n.users_notifications_from_user_idTousers.username,
    from_picture: n.users_notifications_from_user_idTousers.user_picture,
    post_id: n.post_id,
    post_title: n.posts?.title,
    is_read: n.is_read,
    created_at: n.created_at?.toISOString(),
  }));

  return {
    notifications: result,
    unread,
  };
};

export const markAsReadService = async (user_id: number) => {
  await prisma.notifications.updateMany({
    where: { user_id },
    data: { is_read: true },
  });

  return { success: true };
};