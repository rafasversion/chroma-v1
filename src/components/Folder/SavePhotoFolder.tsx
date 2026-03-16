import React, { type FormEvent } from "react";
import styles from "./SavePhotoFolder.module.css";
import { folderService } from "../../services/folderService";
import type { FolderAPI } from "../../types/folderApi";
import photo from "../../assets/photo-register.jpg";
import { savePhotoToFolderService } from "../../services/folderSaveService";
import SubmitButton from "../../components/Form/Button/SubmitButton";
interface FolderModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  photoId: number;
}

const SavePhotoFolder = ({ setModal, photoId }: FolderModalProps) => {
  const [folders, setFolders] = React.useState<FolderAPI[]>([]);
  const [selectedFolders, setSelectedFolders] = React.useState<number[]>([]);

  React.useEffect(() => {
    const token = window.localStorage.getItem("token");
    const loadFolders = async () => {
      const response = await folderService<FolderAPI[]>({
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response) setFolders(response);
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
    e.preventDefault;
    if (selectedFolders.length === 0) return;
    try {
      for (const folderId of selectedFolders) {
        await savePhotoToFolderService(photoId, folderId);
      }
      setModal(false);
    } catch (err) {
      console.error("Error saving to folders.", err);
    }
  };

  return (
    <section className={styles.folderModal}>
      <div className={styles.folderModalContent}>
        <button
          className={styles.closeModalFolder}
          onClick={() => setModal(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h3>Select a folder</h3>
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
                  {folder.capa && folder.capa !== "false" ? (
                    <img src={folder.capa} alt={folder.titulo} />
                  ) : (
                    <img src={photo} alt={folder.titulo} />
                  )}

                  <div className={styles.content}>
                    <h4 className={styles.title}>{folder.titulo}</h4>
                    <span className={styles.privacity}>
                      <i
                        className={`fa-solid ${folder.privada ? "fa-lock" : "fa-lock-open"}`}
                      ></i>{" "}
                      {folder.privada ? "Private" : "Public"}
                    </span>
                    <span className={styles.total}>{folder.total} photos</span>
                  </div>
                </div>
              );
            })}
          </div>
          <SubmitButton type="submit" text="Save" />
        </form>
      </div>
    </section>
  );
};

export default SavePhotoFolder;
