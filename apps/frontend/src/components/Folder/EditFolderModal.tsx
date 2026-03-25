import React from "react";
import styles from "../CreateContent/CreateContentModal.module.css";
import { updateFolderService } from "../../services/folderService";
import type { FolderAPI } from "../../types/folderApi";
import SubmitButton from "../Form/Button/SubmitButton";
import Input from "../Form/Input/Input";
import TextArea from "../Form/Input/TextArea";

interface EditFolderModalProps {
  folder: FolderAPI;
  onClose: () => void;
  onUpdate: () => Promise<void> | void;
}

const EditFolderModal = ({
  folder,
  onClose,
  onUpdate,
}: EditFolderModalProps) => {
  const [titleFolder, setTitleFolder] = React.useState(folder.title);
  const [description, setDescription] = React.useState(
    folder.description || "",
  );
  const [isPrivate, setIsPrivate] = React.useState(folder.is_private);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState<{ preview: string; raw: File } | null>(
    null,
  );

  const processFile = (selectedFile: File) => {
    if (selectedFile.type.startsWith("image/")) {
      setFile({
        preview: URL.createObjectURL(selectedFile),
        raw: selectedFile,
      });
      setError("");
    } else {
      setError("Please select an image.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      processFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleFolder) return setError("The folder needs a name.");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", titleFolder);
    formData.append("description", description);
    formData.append("is_private", isPrivate ? "1" : "0");
    if (file) formData.append("cover", file.raw);

    try {
      await updateFolderService(folder.id, formData);
      await onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error updating folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.postModal}>
      <div className={styles.postModalContent}>
        <button className={styles.closeModal} onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>

        <form onSubmit={handleSubmit}>
          <h2
            style={{ color: "#000", marginBottom: "24px", fontSize: "1.5rem" }}
          >
            Edit Folder
          </h2>

          <div className={styles.folderFormContent}>
            <div
              className={`${styles.folderPhotoPlaceholder} ${dragActive ? styles.dragActive : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label
                htmlFor="folderCover"
                style={{ width: "100%", height: "100%", cursor: "pointer" }}
              >
                {file ? (
                  <img src={file.preview} alt="Preview" />
                ) : folder.cover_url ? (
                  <img src={folder.cover_url} alt="Current cover" />
                ) : (
                  <i className="fa-solid fa-folder" />
                )}
                <div className={styles.uploadOverlay}>
                  <i className="fa-solid fa-cloud-arrow-up" />
                  <span>Change Cover</span>
                </div>
              </label>
              <input
                type="file"
                id="folderCover"
                className={styles.fileInput}
                onChange={({ target }) =>
                  target.files?.[0] && processFile(target.files[0])
                }
                accept="image/*"
              />
            </div>

            <div className={styles.fieldsColumn}>
              <Input
                id="folderTitle"
                type="text"
                placeholder="Folder name"
                value={titleFolder}
                setValue={setTitleFolder}
              />
              <TextArea
                id="description"
                placeholder="Add an optional description"
                rows={5}
                style={{ resize: "none" }}
                value={description}
                setValue={setDescription}
              />
            </div>
          </div>

          {error && (
            <div style={{ color: "#d32f2f", marginBottom: "16px" }}>
              <i className="fa-solid fa-circle-exclamation" /> {error}
            </div>
          )}

          <div className={styles.folderFooter}>
            <button
              type="button"
              className={`${styles.privateBtn} ${isPrivate ? styles.active : ""}`}
              onClick={() => setIsPrivate(!isPrivate)}
            >
              <i
                className={`fa-solid ${isPrivate ? "fa-lock" : "fa-lock-open"}`}
              />
              {isPrivate ? "Private" : "Public"}
            </button>
            <SubmitButton
              type="submit"
              disabled={loading}
              text={loading ? "Saving..." : "Update Folder"}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditFolderModal;
