import React from "react";
import styles from "./CreateContentModal.module.css";
import { createFolderService } from "../../services/folderService";
import SubmitButton from "../Form/Button/SubmitButton";
import Input from "../Form/Input/Input";
import TextArea from "../Form/Input/TextArea";

interface FolderFormProps {
  handleBack: () => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const FolderForm = ({ handleBack, setModal }: FolderFormProps) => {
  const [folderImage, setFolderImage] = React.useState<{
    preview: string;
    raw: File;
  } | null>(null);
  const [titleFolder, setTitleFolder] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);
  const [isPrivate, setIsPrivate] = React.useState(false);

  const processFolderImage = (selectedFile: File) => {
    if (selectedFile.type.startsWith("image/")) {
      setFolderImage({
        preview: URL.createObjectURL(selectedFile),
        raw: selectedFile,
      });
      setError("");
    } else {
      setError("Select a valid image.");
    }
  };

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover")
      setDragActive(true);
    else if (event.type === "dragleave") setDragActive(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleFolder) return setError("Give your folder a name.");
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", titleFolder);
    formData.append("description", description);
    formData.append("is_private", isPrivate ? "1" : "0");
    if (folderImage) formData.append("cover", folderImage.raw);

    try {
      const response = await createFolderService(formData);
      if (response) {
        setModal(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setError(
        "An internal error occurred. Please wait a moment and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={handleBack} className={styles.backBtn}>
        <i className="fa-solid fa-arrow-left" />
      </button>

      <h2 style={{ color: "#000", marginBottom: "24px", fontSize: "1.5rem" }}>
        Create a Folder
      </h2>

      <div className={styles.folderFormContent}>
        <div
          className={`${styles.folderPhotoPlaceholder} ${dragActive ? styles.dragActive : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files?.[0])
              processFolderImage(e.dataTransfer.files[0]);
          }}
        >
          <label
            htmlFor="folderImage"
            style={{ width: "100%", height: "100%", cursor: "pointer" }}
          >
            {folderImage ? (
              <img src={folderImage.preview} alt="Preview" />
            ) : (
              <i className="fa-solid fa-folder" />
            )}
            <div className={styles.uploadOverlay}>
              <i className="fa-solid fa-cloud-arrow-up" />
              <span>Add Cover</span>
            </div>
          </label>
          <input
            type="file"
            id="folderImage"
            className={styles.fileInput}
            onChange={({ target }) =>
              target.files?.[0] && processFolderImage(target.files[0])
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
            autoFocus
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
          <i className={`fa-solid ${isPrivate ? "fa-lock" : "fa-lock-open"}`} />
          {isPrivate ? "Private" : "Public"}
        </button>
        <SubmitButton
          type="submit"
          disabled={loading}
          text={loading ? "Submitting..." : "Submit"}
        />
      </div>
    </form>
  );
};

export default FolderForm;
