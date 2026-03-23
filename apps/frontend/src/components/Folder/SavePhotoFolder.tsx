import React, { type FormEvent } from "react";
import styles from "./SavePhotoFolder.module.css";
import { folderService } from "../../services/folderService";
import type { FolderAPI } from "../../types/folderApi";
import photo from "../../assets/photo-register.jpg";
import { addPostToFolderService } from "../../services/addPostToFolderService";
import SubmitButton from "../../components/Form/Button/SubmitButton";
import { Link } from "react-router-dom";

interface FolderModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  photoId: number;
}

const SavePhotoFolder = ({ setModal, photoId }: FolderModalProps) => {
  const [folders, setFolders] = React.useState<FolderAPI[]>([]);
  const [selectedFolders, setSelectedFolders] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    const loadFolders = async () => {
      setFetching(true);
      const response = await folderService<FolderAPI[]>();
      if (response) setFolders(response);
      setFetching(false);
    };
    loadFolders();
  }, []);

  const toggleFolder = (id: number) => {
    setSelectedFolders((prev) =>
      prev.includes(id)
        ? prev.filter((folderId) => folderId !== id)
        : [...prev, id],
    );
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedFolders.length === 0) return;
    setLoading(true);
    try {
      for (const folderId of selectedFolders) {
        await addPostToFolderService(photoId, folderId);
      }
      setModal(false);
    } catch (err) {
      console.error("Error saving to folders.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.folderModal} onClick={() => setModal(false)}>
      <div
        className={styles.folderModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeModalFolder}
          onClick={() => setModal(false)}
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <h3>Select a folder</h3>

        {fetching ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: "2rem 0" }}>
            Loading folders...
          </p>
        ) : folders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <p style={{ color: "#888", marginBottom: "1rem" }}>
              You don't have any folders yet.
            </p>
            <Link
              to="/board"
              onClick={() => setModal(false)}
              style={{
                display: "inline-block",
                padding: "10px 20px",
                background: "#1a1a1a",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Create a folder
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className={styles.foldersList}>
              {folders.map((folder) => {
                const isSelected = selectedFolders.includes(folder.id);
                return (
                  <div
                    key={folder.id}
                    className={`${styles.folder} ${isSelected ? styles.selected : ""}`}
                    onClick={() => toggleFolder(folder.id)}
                  >
                    <img
                      src={folder.cover_url || photo}
                      alt={folder.title}
                      onError={(e) => {
                        e.currentTarget.src = photo;
                      }}
                    />
                    <div className={styles.content}>
                      <h4 className={styles.title}>{folder.title}</h4>
                      <span className={styles.privacity}>
                        <i
                          className={`fa-solid ${folder.is_private ? "fa-lock" : "fa-lock-open"}`}
                        />{" "}
                        {folder.is_private ? "Private" : "Public"}
                      </span>
                      <span className={styles.total}>
                        {folder.total_items} posts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <SubmitButton
              type="submit"
              text={loading ? "Saving..." : "Save"}
              disabled={loading || selectedFolders.length === 0}
            />
          </form>
        )}
      </div>
    </section>
  );
};

export default SavePhotoFolder;
