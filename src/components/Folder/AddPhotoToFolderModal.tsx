import React from "react";
import styles from "./AddPhotoToFolderModal.module.css";
import { UserContext } from "../../contexts/UserContext";
import { photoService } from "../../services/photoService";
import { savePhotoToFolderService } from "../../services/folderSaveService";
import type { PhotoAPI } from "../../types/photoApi";
import type { FolderAPI } from "../../types/folderApi";
import { X, Check, Upload, Images } from "lucide-react";
import SubmitButton from "../../components/Form/Button/SubmitButton";

interface Props {
  folder: FolderAPI;
  onClose: () => void;
  onUpdate: () => void;
}

const AddPhotoToFolderModal = ({ folder, onClose, onUpdate }: Props) => {
  const { username } = React.useContext(UserContext);
  const [tab, setTab] = React.useState<"photos" | "upload">("photos");
  const [myPhotos, setMyPhotos] = React.useState<PhotoAPI[]>([]);
  const [loadingPhotos, setLoadingPhotos] = React.useState(false);
  const [saving, setSaving] = React.useState<number | null>(null);
  const [saved, setSaved] = React.useState<number[]>([]);

  const [file, setFile] = React.useState<{
    preview: string;
    raw: File;
    type: string;
  } | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);

  const alreadyInFolder = React.useMemo(
    () => (folder.posts || []).map((p) => p.id),
    [folder.posts],
  );

  React.useEffect(() => {
    if (tab !== "photos" || !username) return;
    async function load() {
      setLoadingPhotos(true);
      const data = await photoService(
        { _user: username, _total: 100 },
        { method: "GET" },
      );
      if (data && Array.isArray(data)) {
        setMyPhotos(data.filter((p) => !alreadyInFolder.includes(p.id)));
      }
      setLoadingPhotos(false);
    }
    load();
  }, [tab, username, alreadyInFolder]);

  const handleAdd = async (photoId: number) => {
    setSaving(photoId);
    await savePhotoToFolderService(photoId, folder.id);
    setSaved((prev) => [...prev, photoId]);
    setSaving(null);
    onUpdate();
  };

  const processFile = (f: File) => {
    if (f.type.startsWith("image/") || f.type.startsWith("video/")) {
      setFile({ preview: URL.createObjectURL(f), raw: f, type: f.type });
      setUploadError("");
    } else {
      setUploadError("Select an image or video.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleUploadAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !description)
      return setUploadError("Fill in all fields.");
    setUploading(true);
    setUploadError("");

    const token = window.localStorage.getItem("token");
    const formData = new FormData();
    formData.append("img", file.raw);
    formData.append("titulo", title);
    formData.append("descricao", description);

    try {
      const response = (await photoService(
        {},
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      )) as any;

      if (response?.id) {
        await savePhotoToFolderService(response.id, folder.id);
        onUpdate();
        onClose();
      }
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            Add to <em>{folder.titulo}</em>
          </h2>
          <button className={styles.closeModal} onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "photos" ? styles.activeTab : ""}`}
            onClick={() => setTab("photos")}
          >
            <Images size={16} /> My Photos
          </button>
          <button
            className={`${styles.tab} ${tab === "upload" ? styles.activeTab : ""}`}
            onClick={() => setTab("upload")}
          >
            <Upload size={16} /> Upload New
          </button>
        </div>

        <div className={styles.body}>
          {tab === "photos" && (
            <>
              {loadingPhotos && (
                <p className={styles.hint}>Loading photos...</p>
              )}
              {!loadingPhotos && myPhotos.length === 0 && (
                <p className={styles.hint}>No photos available to add.</p>
              )}
              <div className={styles.photoGrid}>
                {myPhotos.map((photo) => {
                  const isSaved = saved.includes(photo.id);
                  return (
                    <div
                      key={photo.id}
                      className={`${styles.photoItem} ${isSaved ? styles.photoSaved : ""}`}
                      onClick={() => !isSaved && handleAdd(photo.id)}
                    >
                      {photo.is_video ? (
                        <video src={photo.src} muted />
                      ) : (
                        <img src={photo.src} alt={photo.title} />
                      )}
                      <div className={styles.photoItemOverlay}>
                        {saving === photo.id && (
                          <span className={styles.spinner} />
                        )}
                        {isSaved && <Check size={22} strokeWidth={2.5} />}
                        {!isSaved && saving !== photo.id && (
                          <span className={styles.addLabel}>Add</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === "upload" && (
            <form className={styles.uploadForm} onSubmit={handleUploadAndAdd}>
              <div
                className={`${styles.dropzone} ${dragActive ? styles.dragActive : ""} ${file ? styles.hasFile : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!file ? (
                  <label htmlFor="uploadFile" className={styles.dropzoneLabel}>
                    <Upload size={28} />
                    <span>
                      Drag & drop or <u>browse</u>
                    </span>
                    <small>Images and videos supported</small>
                  </label>
                ) : (
                  <div className={styles.previewWrap}>
                    <button
                      type="button"
                      className={styles.removeFile}
                      onClick={() => setFile(null)}
                    >
                      <X size={14} />
                    </button>
                    {file.type.startsWith("video/") ? (
                      <video
                        src={file.preview}
                        controls
                        className={styles.preview}
                      />
                    ) : (
                      <img
                        src={file.preview}
                        alt="preview"
                        className={styles.preview}
                      />
                    )}
                  </div>
                )}
                <input
                  id="uploadFile"
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    e.target.files?.[0] && processFile(e.target.files[0])
                  }
                />
              </div>

              <input
                className={styles.input}
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className={styles.input}
                placeholder="Description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {uploadError && (
                <span className={styles.error}>{uploadError}</span>
              )}

              <SubmitButton text="Upload & Add to Folder" />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPhotoToFolderModal;
