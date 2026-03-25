import { prisma } from '../utils/prisma';

export const searchService = async (query: string) => {
  if (!query || query.length < 2) {
    throw new Error('Very short query.');
  }

  const posts = await prisma.posts.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: {
      users: true,
      likes: true,
    },
    take: 10,
  });

  const byAuthor = await prisma.posts.findMany({
    where: {
      users: {
        username: { contains: query },
      },
    },
    include: {
      users: true,
      likes: true,
    },
    take: 10,
  });

  const allPosts = [...posts, ...byAuthor];
  const uniquePosts = Array.from(
    new Map(allPosts.map((p) => [p.id, p])).values()
  );

  const postsResult = uniquePosts.map((post: any) => ({
    id: post.id,
    title: post.title,
    src: post.file_url,
    is_video: post.is_video,
    author: post.users.username,
  }));

  const users = await prisma.users.findMany({
    where: {
      OR: [
        { username: { contains: query } },
        { username: { startsWith: query } },
      ],
    },
    select: {
      id: true,
      username: true,
      user_picture: true,
    },
    take: 8,
  });

  const usersResult = users.map((user: any) => ({
    id: user.id,
    username: user.username,
    name: user.name,
    picture: user.user_picture,
  }));

  return {
    posts: postsResult,
    users: usersResult,
  };
};