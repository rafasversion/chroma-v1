import React from "react";
import styles from "../PostModal/PostModal.module.css";
import { folderService } from "../../services/folderService";
import type { FolderAPI } from "../../types/folderApi";
import SubmitButton from "../../components/Form/Button/SubmitButton";
import Input from "../../components/Form/Input/Input";
import TextArea from "../../components/Form/Input/TextArea";

interface EditFolderModalProps {
  folder: FolderAPI;
  onClose: () => void;
  onUpdate: () => void;
}

const EditFolderModal = ({
  folder,
  onClose,
  onUpdate,
}: EditFolderModalProps) => {
  const [nameFolder, setNameFolder] = React.useState(folder.titulo);
  const [description, setDescription] = React.useState(folder.descricao || "");
  const [isPrivate, setIsPrivate] = React.useState(folder.privada);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.files && target.files[0]) processFile(target.files[0]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nameFolder) return setError("The folder needs a name.");

    setLoading(true);
    const token = window.localStorage.getItem("token");
    const formData = new FormData();
    formData.append("id", String(folder.id));
    formData.append("nome", nameFolder);
    formData.append("descricao", description);
    formData.append("privada", isPrivate ? "1" : "0");
    if (file) formData.append("capa", file.raw);

    try {
      await folderService(
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
        "pasta/update",
      );

      onUpdate();
      onClose();
    } catch (err) {
      setError("Error updating folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.postModal}>
      <div className={styles.postModalContent}>
        <button className={styles.closeModal} onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
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
                htmlFor="folderCapa"
                style={{ width: "100%", height: "100%", cursor: "pointer" }}
              >
                {file ? (
                  <img src={file.preview} alt="Preview" />
                ) : folder.capa ? (
                  <img src={folder.capa} alt="Capa atual" />
                ) : (
                  <i className="fa-solid fa-folder"></i>
                )}

                <div className={styles.uploadOverlay}>
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>Change Cover</span>
                </div>
              </label>

              <input
                type="file"
                id="folderCapa"
                className={styles.fileInput}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className={styles.fieldsColumn}>
              <div className={styles.inputGroup}>
                <Input
                  id="folderName"
                  type="text"
                  placeholder="Folder name"
                  value={nameFolder}
                  setValue={setNameFolder}
                />
              </div>

              <div className={styles.inputGroup}>
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
          </div>

          {error && (
            <div style={{ color: "#d32f2f", marginBottom: "16px" }}>
              <i className="fa-solid fa-circle-exclamation"></i> {error}
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
              ></i>
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
