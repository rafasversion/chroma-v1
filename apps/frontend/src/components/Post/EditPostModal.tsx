import React from "react";
import styles from "../CreateContent/CreateContentModal.module.css";
import { updatePostService } from "../../services/updatePostService";
import type { PostAPI } from "../../types/postApi";

interface EditPhotoModalProps {
  post: PostAPI;
  onClose: () => void;
  onUpdate: () => void;
}

const EditPostModal = ({ post, onClose, onUpdate }: EditPhotoModalProps) => {
  const [title, setTitle] = React.useState(post.title);
  const [description, setDescription] = React.useState(post.description || "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title) return setError("The post needs a title.");
    setLoading(true);

    try {
      await updatePostService(post.id, { title, description });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error updating post.");
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
            Edit Post
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
                />
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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPostModal;
