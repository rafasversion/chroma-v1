import React from "react";
import styles from "./AddPhotoToFolderModal.module.css";
import { UserContext } from "../../contexts/UserContext";
import { postService } from "../../services/postService";
import { addPostToFolderService } from "../../services/addPostToFolderService";
import type { PostAPI } from "../../types/postApi";
import type { FolderAPI } from "../../types/folderApi";
import { X, Check, Upload, Images } from "lucide-react";
import SubmitButton from "../Form/Button/SubmitButton";

interface Props {
  folder: FolderAPI;
  onClose: () => void;
  onUpdate: () => void;
}

const AddPhotoToFolderModal = ({ folder, onClose, onUpdate }: Props) => {
  const { username } = React.useContext(UserContext);
  const [tab, setTab] = React.useState<"posts" | "upload">("posts");
  const [myPosts, setMyPosts] = React.useState<PostAPI[]>([]);
  const [loadingPosts, setLoadingPosts] = React.useState(false);
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
    if (tab !== "posts" || !username) return;
    async function load() {
      setLoadingPosts(true);
      const data = await postService(
        { _user: username, _total: 100 },
        { method: "GET" },
      );
      if (data && Array.isArray(data)) {
        setMyPosts(data.filter((p) => !alreadyInFolder.includes(p.id)));
      }
      setLoadingPosts(false);
    }
    load();
  }, [tab, username, alreadyInFolder]);

  const handleAdd = async (postId: number) => {
    setSaving(postId);
    await addPostToFolderService(postId, folder.id);
    setSaved((prev) => [...prev, postId]);
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
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await postService(
        {},
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (response && "id" in response && response.id) {
        await addPostToFolderService(response.id, folder.id);
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
            Add to <em>{folder.title}</em>
          </h2>
          <button className={styles.closeModal} onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "posts" ? styles.activeTab : ""}`}
            onClick={() => setTab("posts")}
          >
            <Images size={16} /> My Posts
          </button>
          <button
            className={`${styles.tab} ${tab === "upload" ? styles.activeTab : ""}`}
            onClick={() => setTab("upload")}
          >
            <Upload size={16} /> Upload New
          </button>
        </div>

        <div className={styles.body}>
          {tab === "posts" && (
            <>
              {loadingPosts && <p className={styles.hint}>Loading posts...</p>}
              {!loadingPosts && myPosts.length === 0 && (
                <p className={styles.hint}>No posts available to add.</p>
              )}
              <div className={styles.photoGrid}>
                {myPosts.map((post) => {
                  const isSaved = saved.includes(post.id);
                  return (
                    <div
                      key={post.id}
                      className={`${styles.photoItem} ${isSaved ? styles.photoSaved : ""}`}
                      onClick={() => !isSaved && handleAdd(post.id)}
                    >
                      {post.is_video ? (
                        <video src={post.file_url} muted />
                      ) : (
                        <img src={post.file_url} alt={post.title} />
                      )}
                      <div className={styles.photoItemOverlay}>
                        {saving === post.id && (
                          <span className={styles.spinner} />
                        )}
                        {isSaved && <Check size={22} strokeWidth={2.5} />}
                        {!isSaved && saving !== post.id && (
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
              <SubmitButton
                text={uploading ? "Uploading..." : "Upload & Add to Folder"}
                disabled={uploading}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPhotoToFolderModal;
