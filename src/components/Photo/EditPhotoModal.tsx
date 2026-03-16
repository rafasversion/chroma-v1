import React from "react";
import styles from "../PostModal/PostModal.module.css";
import { updatePhotoService } from "../../services/updatePhotoService";
import type { PhotoAPI } from "../../types/photoApi";

interface EditPhotoModalProps {
  photo: PhotoAPI;
  onClose: () => void;
  onUpdate: () => void;
}

const EditPhotoModal = ({ photo, onClose, onUpdate }: EditPhotoModalProps) => {
  const [title, setTitle] = React.useState(photo.title);
  const [description, setDescription] = React.useState(photo.content || "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title) return setError("The photo needs a name.");
    setLoading(true);
    const formData = new FormData();
    formData.append("id", String(photo.id));
    formData.append("titulo", title);
    formData.append("descricao", description);

    try {
      await updatePhotoService(photo.id, formData);
      onUpdate();
      onClose();
    } catch (err) {
      setError("Error updating photo.");
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
            Edit Photo
          </h2>

          <div className={styles.photoFormContent}>
            <div className={styles.fieldsColumn}>
              <div className={styles.inputGroup}>
                <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Title
                </label>
                <input
                  className={styles.input}
                  type="text"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Description
                </label>
                <textarea
                  className={styles.input}
                  rows={5}
                  style={{ resize: "none" }}
                  value={description}
                  onChange={({ target }) => setDescription(target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "0.8rem", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <div className={styles.folderFooter}>
            <button
              className={styles.submitPost}
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPhotoModal;
