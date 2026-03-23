import { prisma } from '../utils/prisma';

function formatFolder(folder: any) {
  return {
    id: folder.id,
    title: folder.title,
    description: folder.description || '',
    cover_url: folder.cover_url || null,
    is_private: folder.is_private ?? false,
    total_items: folder.folder_items?.length || 0,
    author: folder.users?.username || '',
    created_at: folder.created_at?.toISOString(),
  };
}

export const createFolderService = async (
  user_id: number,
  title: string,
  description?: string,
  is_private?: boolean,
  cover_url?: string,
) => {
  const folder = await prisma.folders.create({
    data: {
      user_id,
      title,
      description: description || '',
      is_private: !!is_private,
      cover_url: cover_url || null,
    },
    include: { folder_items: true, users: true },
  });

  return { ...formatFolder(folder), message: 'Folder created successfully!' };
};

export const getFoldersService = async (user_id: number) => {
  const folders = await prisma.folders.findMany({
    where: { user_id },
    include: {
      folder_items: { include: { posts: true } },
      users: true,
    },
    orderBy: { created_at: 'desc' },
  });

  return folders.map((folder: any) => {
    const auto_cover =
      !folder.cover_url && folder.folder_items.length > 0
        ? folder.folder_items[0].posts.file_url
        : null;

    return {
      ...formatFolder(folder),
      cover_url: folder.cover_url || auto_cover,
    };
  });
};

export const getFolderService = async (folder_id: number) => {
  const folder = await prisma.folders.findUnique({
    where: { id: folder_id },
    include: {
      folder_items: {
        include: {
          posts: {
            include: {
              users: { select: { id: true, username: true } },
              likes: true,
              comments: true,
            },
          },
        },
      },
      users: true,
    },
  });

  if (!folder) throw new Error('Pasta não encontrada.');

  const posts = folder.folder_items.map((item: any) => ({
    id: item.posts.id,
    title: item.posts.title,
    file_url: item.posts.file_url,
    is_video: item.posts.is_video,
    content: item.posts.description,
    author: item.posts.users.username,
    author_id: item.posts.users.id,
    total_likes: item.posts.likes.length,
    total_comments: item.posts.comments.length,
    access_number: item.posts.access_count || 0,
    dominant_color: item.posts.dominant_color,
  }));

  return { ...formatFolder(folder), posts };
};

export const getFoldersByUsernameService = async (username: string) => {
  const user = await prisma.users.findUnique({ where: { username } });
  if (!user) throw new Error('User not found.');

  const folders = await prisma.folders.findMany({
    where: { user_id: user.id },
    include: {
      folder_items: { include: { posts: true } },
      users: true,
    },
    orderBy: { created_at: 'desc' },
  });

  return folders.map((folder: any) => {
    const auto_cover =
      !folder.cover_url && folder.folder_items.length > 0
        ? folder.folder_items[0].posts.file_url
        : null;
    return {
      ...formatFolder(folder),
      cover_url: folder.cover_url || auto_cover,
    };
  });
};

export const updateFolderService = async (
  folder_id: number,
  user_id: number,
  title?: string,
  description?: string,
  is_private?: boolean,
  cover_url?: string,
) => {
  const folder = await prisma.folders.findUnique({ where: { id: folder_id } });
  if (!folder || folder.user_id !== user_id)
    throw new Error('No permission or folder not found.');

  const data: any = {};
  if (title) data.title = title;
  if (description !== undefined) data.description = description;
  if (is_private !== undefined) data.is_private = is_private;
  if (cover_url) data.cover_url = cover_url;

  await prisma.folders.update({ where: { id: folder_id }, data });
  return { message: 'Folder updated successfully!' };
};

export const deleteFolderService = async (folder_id: number, user_id: number) => {
  const folder = await prisma.folders.findUnique({ where: { id: folder_id } });
  if (!folder || folder.user_id !== user_id) throw new Error('No permission.');

  await prisma.folders.delete({ where: { id: folder_id } });
  return { message: 'Pasta removida.' };
};

export const addPhotoToFolderService = async (
  post_id: number,
  folder_id: number,
  user_id: number,
) => {
  const folder = await prisma.folders.findUnique({ where: { id: folder_id } });
  if (!folder || folder.user_id !== user_id) throw new Error('Invalid folder.');

  const existing = await prisma.folder_items.findUnique({
    where: { folder_id_post_id: { folder_id, post_id } },
  });

  if (!existing) {
    await prisma.folder_items.create({ data: { folder_id, post_id } });
  }

  const total_items = await prisma.folder_items.count({ where: { folder_id } });
  return {
    message: existing ? 'The post is already in the folder.' : 'Post saved in folder.',
    total_items,
  };
};

export const removePhotoFromFolderService = async (
  post_id: number,
  folder_id: number,
  user_id: number,
) => {
  const folder = await prisma.folders.findUnique({ where: { id: folder_id } });
  if (!folder || folder.user_id !== user_id) throw new Error('Invalid folder.');

  await prisma.folder_items.deleteMany({ where: { folder_id, post_id } });

  const total_items = await prisma.folder_items.count({ where: { folder_id } });
  return { message: 'Post removed from folder.', total_items };
};