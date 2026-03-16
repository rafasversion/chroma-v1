import React from "react";
import { useParams } from "react-router-dom";
import { userService } from "../services/userService";
import { userByUsernameService } from "../services/userByUsernameService";
import { userFoldersService } from "../services/userFoldersService";
import { userPostsService } from "../services/userPostsService";
import { userLikesService } from "../services/userLikesService";
import type { FolderAPI } from "../types/folderApi";
import type { PhotoAPI } from "../types/photoApi";

type TabType = "folders" | "posts" | "likes";

interface UseBoardDataReturn {
  user: any;
  currentUser: any;
  activeTab: TabType;
  folders: FolderAPI[];
  posts: PhotoAPI[];
  likes: PhotoAPI[];
  loading: boolean;
  isOwnProfile: boolean;
  refreshFolders: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useBoardData = (isLogged: boolean): UseBoardDataReturn => {
  const { username, tab } = useParams<{ username: string; tab?: string }>();

  const [user, setUser] = React.useState<any>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [folders, setFolders] = React.useState<FolderAPI[]>([]);
  const [posts, setPosts] = React.useState<PhotoAPI[]>([]);
  const [likes, setLikes] = React.useState<PhotoAPI[]>([]);
  const [loading, setLoading] = React.useState(true);

  const activeTab = (tab as TabType) || "folders";

  const isOwnProfile = React.useMemo(() => {
    return currentUser?.username === user?.username;
  }, [currentUser, user]);

  const refreshFolders = async () => {
    const data = await userFoldersService(user?.username);
    setFolders(isOwnProfile ? data : data.filter((f) => !f.privada));
  };

  const refreshUser = async () => {
    const data = await userService();
    if (data) setUser(data);
  };

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const token = window.localStorage.getItem("token");
      let current = null;
      if (token) {
        current = await userService();
        setCurrentUser(current);
      }
      const profile = username
        ? await userByUsernameService(username)
        : current;
      setUser(profile);
      setLoading(false);
    }
    loadData();
  }, [username, isLogged]);

  React.useEffect(() => {
    if (!user) return;
    async function fetchContent() {
      if (activeTab === "folders") {
        const data = await userFoldersService(user.username);
        setFolders(isOwnProfile ? data : data.filter((f) => !f.privada));
      } else if (activeTab === "posts") {
        const data = await userPostsService(user.username);
        setPosts(data);
      } else if (activeTab === "likes" && isOwnProfile) {
        const data = await userLikesService();
        setLikes(data);
      }
    }
    fetchContent();
  }, [activeTab, user, isOwnProfile]);

  return {
    user,
    currentUser,
    activeTab,
    folders,
    posts,
    likes,
    loading,
    isOwnProfile,
    refreshFolders,
    refreshUser,
  };
};