import React from "react";
import { Link } from "react-router-dom";
import styles from "../../pages/Board/Board.module.css";
import photoDefault from "../../assets/photo-register.jpg";
import FolderOptions from "../Folder/FolderOptions";
import type { FolderAPI } from "../../types/folderApi";

interface FoldersListProps {
  folders: FolderAPI[];
  isOwnProfile: boolean;
  onEditFolder: (folder: FolderAPI) => void;
  onDeleteFolder: (folder: FolderAPI) => void;
}

const FoldersList = ({
  folders,
  isOwnProfile,
  onEditFolder,
  onDeleteFolder,
}: FoldersListProps) => {
  const [brokenImages, setBrokenImages] = React.useState<
    Record<number, boolean>
  >({});

  const handleImageError = (folderId: number) => {
    setBrokenImages((prev) => ({ ...prev, [folderId]: true }));
  };

  const foldersToDisplay = folders.filter((folder) => {
    if (isOwnProfile) {
      return true;
    }
    return !folder.is_private;
  });

  return (
    <div className={styles.foldersList}>
      {foldersToDisplay.length === 0 && (
        <p style={{ margin: "1rem auto" }}>No folders.</p>
      )}
      {foldersToDisplay.map((folder) => {
        let imageSrc = photoDefault;
        if (!brokenImages[folder.id]) {
          if (folder.cover_url && folder.cover_url.trim()) {
            imageSrc = folder.cover_url;
          }
        }

        return (
          <div
            key={folder.id}
            className={styles.folderWrapper}
            style={{ position: "relative" }}
          >
            {isOwnProfile && (
              <FolderOptions
                onEdit={() => onEditFolder(folder)}
                onDelete={() => onDeleteFolder(folder)}
              />
            )}
            <Link to={`/folder/${folder.id}`} className={styles.folder}>
              <img
                src={imageSrc}
                alt={folder.title}
                onError={() => handleImageError(folder.id)}
              />
              <div className={styles.folderContent}>
                <h4 className={styles.title}>{folder.title}</h4>
                <div className={styles.folderMeta}>
                  <span className={styles.privacity}>
                    <i
                      className={`fa-solid ${
                        folder.is_private ? "fa-lock" : "fa-lock-open"
                      }`}
                    ></i>
                    {folder.is_private ? " Private" : " Public"}
                  </span>
                  <span className={styles.total}>
                    {folder.total_items || 0} photos
                  </span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default FoldersList;
