import React from "react";
import { likeService } from "../services/likeService";
import { deleteFolderService } from "../services/deleteFolderService";
import { deletePostService } from "../services/deletePostService";
import type { PhotoAPI } from "../types/photoApi";

interface UseBoardActionsReturn {
  handleLike: (
    e: React.MouseEvent,
    photoId: number,
    currentlyLiked: boolean,
  ) => Promise<void>;
  confirmDeleteFolder: (id: number) => Promise<void>;
  confirmDeletePhoto: (id: number) => Promise<void>;
  isDeleting: boolean;
  updatePostsAfterLike: (
    prevList: PhotoAPI[],
    photoId: number,
    liked: boolean,
    likeCount: number,
  ) => PhotoAPI[];
}

export const useBoardActions = (
  setPosts: React.Dispatch<React.SetStateAction<PhotoAPI[]>>,
  setLikes: React.Dispatch<React.SetStateAction<PhotoAPI[]>>,
  setFolders: React.Dispatch<any>,
  setPhotoToDelete: React.Dispatch<any>,
  setFolderToDelete: React.Dispatch<any>,
): UseBoardActionsReturn => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const updatePostsAfterLike = (
    prevList: PhotoAPI[],
    photoId: number,
    liked: boolean,
    likeCount: number,
  ): PhotoAPI[] => {
    return prevList.map((item) =>
      item.id === photoId
        ? {
          ...item,
          user_liked: liked,
          total_likes: likeCount,
        }
        : item,
    );
  };

  const handleLike = async (
    e: React.MouseEvent,
    photoId: number,
    currentlyLiked: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const token = window.localStorage.getItem("token");
    if (!token) return;

    const response = await likeService(photoId.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      const updateList = (prevList: PhotoAPI[]) =>
        updatePostsAfterLike(
          prevList,
          photoId,
          !currentlyLiked,
          response.count,
        );
      setPosts(updateList);
      setLikes(updateList);
    }
  };

  const confirmDeleteFolder = async (id: number) => {
    try {
      setIsDeleting(true);
      const token = window.localStorage.getItem("token");
      await deleteFolderService(id.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders((prev: any[]) => prev.filter((f) => f.id !== id));
      setFolderToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeletePhoto = async (id: number) => {
    try {
      setIsDeleting(true);
      const token = window.localStorage.getItem("token");
      await deletePostService(id.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((f) => f.id !== id));
      setPhotoToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleLike,
    confirmDeleteFolder,
    confirmDeletePhoto,
    isDeleting,
    updatePostsAfterLike,
  };
};