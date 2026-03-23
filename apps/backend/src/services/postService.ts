import { prisma } from '../utils/prisma';
import { extractDominantColor } from '../utils/colors';

function formatComment(comment: any, requesting_user_id?: number) {
  return {
    comment_id: comment.id,
    comment_author: comment.users.username,
    comment_content: comment.content,
    comment_date: comment.created_at?.toISOString(),
    user_id: comment.user_id,
    user_picture: comment.users.user_picture || '',
    total_likes: comment.comment_likes?.length || 0,
    user_liked_comment: requesting_user_id
      ? comment.comment_likes?.some((cl: any) => cl.user_id === requesting_user_id)
      : false,
    replies: (comment.other_comments || []).map((r: any) => ({
      comment_id: r.id,
      comment_author: r.users.username,
      comment_content: r.content,
      comment_date: r.created_at?.toISOString(),
      user_id: r.user_id,
      user_picture: r.users.user_picture || '',
      total_likes: r.comment_likes?.length || 0,
      user_liked_comment: requesting_user_id
        ? r.comment_likes?.some((cl: any) => cl.user_id === requesting_user_id)
        : false,
    })),
  };
}

export const createPostService = async (
  user_id: number,
  title: string,
  description: string,
  file_url: string,
  is_video: boolean,
  filePath?: string,
) => {
  let dominant_color = null;
  if (!is_video && filePath) {
    dominant_color = await extractDominantColor(filePath);
  }

  const post = await prisma.posts.create({
    data: { user_id, title, description, file_url, is_video, dominant_color },
  });

  return {
    id: post.id,
    title: post.title,
    file_url: post.file_url,
    is_video: post.is_video,
    dominant_color: post.dominant_color,
    date: post.created_at?.toISOString(),
  };
};

export const getPostService = async (post_id: number, requesting_user_id?: number) => {
  const post = await prisma.posts.findUnique({
    where: { id: post_id },
    include: {
      users: { select: { id: true, username: true, user_picture: true } },
      likes: true,
      comments: {
        where: { parent_id: null },
        include: {
          users: { select: { id: true, username: true, user_picture: true } },
          comment_likes: true,
          other_comments: {
            include: {
              users: { select: { id: true, username: true, user_picture: true } },
              comment_likes: true,
            },
            orderBy: { created_at: 'asc' },
          },
        },
        orderBy: { created_at: 'asc' },
      },
    },
  });

  if (!post) throw new Error('Post not found.');

  await prisma.posts.update({
    where: { id: post_id },
    data: { access_count: (post.access_count || 0) + 1 },
  });

  const postData = {
    id: post.id,
    author: post.users.username,
    author_id: post.users.id,
    author_picture: post.users.user_picture || '',
    title: post.title,
    date: post.created_at?.toISOString(),
    file_url: post.file_url,
    is_video: post.is_video,
    description: post.description,
    access_number: (post.access_count || 0) + 1,
    total_comments: post.comments.length,
    total_likes: post.likes.length,
    user_liked: requesting_user_id
      ? post.likes.some((l: any) => l.user_id === requesting_user_id)
      : false,
    dominant_color: post.dominant_color,
  };

  const comments = post.comments.map((c: any) => formatComment(c, requesting_user_id));

  return { post: postData, comments };
};

export const getPostsService = async (
  user_id?: number,
  total: number = 21,
  page: number = 1,
  color?: string,
  requesting_user_id?: number,
) => {
  const posts = await prisma.posts.findMany({
    where: {
      ...(user_id && { user_id }),
      ...(color && { dominant_color: { not: null } }),
    },
    include: {
      users: { select: { id: true, username: true, user_picture: true } },
      likes: true,
      comments: true,
    },
    orderBy: { created_at: 'desc' },
    skip: (page - 1) * total,
    take: color ? total * 5 : total,
  });

  let result = posts.map((post: any) => ({
    id: post.id,
    author: post.users.username,
    author_id: post.users.id,
    author_picture: post.users.user_picture || '',
    title: post.title,
    date: post.created_at?.toISOString(),
    file_url: post.file_url,
    is_video: post.is_video,
    description: post.description,
    access_number: post.access_count || 0,
    total_comments: post.comments.length,
    total_likes: post.likes.length,
    user_liked: requesting_user_id
      ? post.likes.some((l: any) => l.user_id === requesting_user_id)
      : false,
    dominant_color: post.dominant_color,
  }));

  if (color && color !== 'null') {
    const [tr, tg, tb] = color.split(',').map(Number);
    const tolerance = 120;
    result = result.filter((post: any) => {
      if (!post.dominant_color) return false;
      const [r, g, b] = post.dominant_color.split(',').map(Number);
      const distance = Math.sqrt(
        Math.pow(r - tr, 2) + Math.pow(g - tg, 2) + Math.pow(b - tb, 2),
      );
      return distance <= tolerance;
    });
    result = result.slice(0, total);
  }

  return result;
};

export const updatePostService = async (
  post_id: number,
  user_id: number,
  title: string,
  description: string,
) => {
  const post = await prisma.posts.findUnique({ where: { id: post_id } });
  if (!post || post.user_id !== user_id) throw new Error('No permission or post not found.');
  if (!title || !description) throw new Error('Incomplete data.');

  await prisma.posts.update({
    where: { id: post_id },
    data: { title, description },
  });

  return { message: 'Post updated successfully!' };
};

export const deletePostService = async (post_id: number, user_id: number) => {
  const post = await prisma.posts.findUnique({ where: { id: post_id } });
  if (!post || post.user_id !== user_id) throw new Error('No permission.');

  await prisma.posts.delete({ where: { id: post_id } });
  return { message: 'Post deletado.' };
};