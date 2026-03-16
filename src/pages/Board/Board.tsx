import React from "react";
import styles from "./Board.module.css";
import { UserContext } from "../../contexts/UserContext";
import NotLoggedProfile from "../../components/User/NotLoggedProfile";
import EditFolderModal from "../../components/Folder/EditFolderModal";
import DeleteFolderModal from "../../components/Folder/DeleteFolderModal";
import DeletePhotoModal from "../../components/Photo/DeletePhotoModal";
import EditPhotoModal from "../../components/Photo/EditPhotoModal";
import EditProfileModal from "../../components/User/EditProfileModal";
import ProfileCard from "../../components/Board/ProfileCard";
import TabNavigation from "../../components/Board/TabNavigation";
import FoldersList from "../../components/Board/FoldersList";
import PhotoGrid from "../../components/Board/PhotoGrid";

import { useBoardData } from "../../hooks/useBoardData";
import { useBoardActions } from "../../hooks/useBoardActions";

import type { FolderAPI } from "../../types/folderApi";
import type { PhotoAPI } from "../../types/photoApi";

type TabType = "folders" | "posts" | "likes";

const Board = () => {
  const { isLogged } = React.useContext(UserContext);

  const {
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
  } = useBoardData(isLogged);

  const [folderToEdit, setFolderToEdit] = React.useState<FolderAPI | null>(
    null,
  );
  const [folderToDelete, setFolderToDelete] = React.useState<FolderAPI | null>(
    null,
  );
  const [photoToEdit, setPhotoToEdit] = React.useState<PhotoAPI | null>(null);
  const [photoToDelete, setPhotoToDelete] = React.useState<PhotoAPI | null>(
    null,
  );
  const [editProfile, setEditProfile] = React.useState(false);

  const [postsState, setPostsState] = React.useState(posts);
  const [likesState, setLikesState] = React.useState(likes);
  const [foldersState, setFoldersState] = React.useState(folders);

  React.useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  React.useEffect(() => {
    setLikesState(likes);
  }, [likes]);

  React.useEffect(() => {
    setFoldersState(folders);
  }, [folders]);

  const { handleLike, confirmDeleteFolder, confirmDeletePhoto, isDeleting } =
    useBoardActions(
      setPostsState,
      setLikesState,
      setFoldersState,
      setPhotoToDelete,
      setFolderToDelete,
    );

  const handleTabChange = (newTab: TabType) => {
    if (user?.username) {
      window.location.href = `/board/${user.username}/${newTab}`;
    }
  };

  const displayItems = activeTab === "posts" ? postsState : likesState;

  if (loading) return null;
  if (!user) return <NotLoggedProfile />;

  return (
    <div className={styles.container}>
      <ProfileCard
        user={user}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => setEditProfile(true)}
      />

      <TabNavigation
        activeTab={activeTab}
        isOwnProfile={isOwnProfile}
        onTabChange={handleTabChange}
      />

      <div className={styles.contentSection}>
        {activeTab === "folders" ? (
          <FoldersList
            folders={foldersState}
            isOwnProfile={isOwnProfile}
            onEditFolder={setFolderToEdit}
            onDeleteFolder={setFolderToDelete}
          />
        ) : (
          <PhotoGrid
            photos={displayItems}
            isOwnProfile={isOwnProfile}
            activeTab={activeTab}
            onLike={handleLike}
            onEditPhoto={setPhotoToEdit}
            onDeletePhoto={setPhotoToDelete}
          />
        )}
      </div>

      {folderToEdit && (
        <EditFolderModal
          folder={folderToEdit}
          onClose={() => setFolderToEdit(null)}
          onUpdate={refreshFolders}
        />
      )}

      {folderToDelete && (
        <DeleteFolderModal
          folder={folderToDelete}
          loading={isDeleting}
          onClose={() => setFolderToDelete(null)}
          onConfirm={() => confirmDeleteFolder(folderToDelete.id)}
        />
      )}

      {photoToDelete && (
        <DeletePhotoModal
          photo={photoToDelete}
          loading={isDeleting}
          onClose={() => setPhotoToDelete(null)}
          onConfirm={() => confirmDeletePhoto(photoToDelete.id)}
        />
      )}

      {photoToEdit && (
        <EditPhotoModal
          photo={photoToEdit}
          onClose={() => setPhotoToEdit(null)}
          onUpdate={refreshFolders}
        />
      )}

      {editProfile && (
        <EditProfileModal
          user={user}
          setModal={setEditProfile}
          onUpdate={refreshUser}
        />
      )}
    </div>
  );
};

export default Board;
