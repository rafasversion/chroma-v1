import React from "react";
import styles from "../CreateContent/CreateContentModal.module.css";
import { updatePostService } from "../../services/updatePostService";
import type { PostAPI } from "../../types/postApi";
import Input from "../Form/Input/Input";
import TextArea from "../Form/Input/TextArea";
import SubmitButton from "../Form/Button/SubmitButton";

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
      await onUpdate();
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
      <div className={styles.postModalContent} style={{ maxWidth: "500px" }}>
        <button className={styles.closeModal} onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <form onSubmit={handleSubmit}>
          <h2
            style={{ color: "#000", marginBottom: "24px", fontSize: "1.5rem" }}
          >
            Edit Post
          </h2>

          <div className={styles.fieldsColumn}>
            <Input
              id="title"
              label="Title"
              type="text"
              value={title}
              setValue={setTitle}
            />
            <TextArea
              id="description"
              label="Description"
              rows={5}
              style={{ resize: "none" }}
              value={description}
              setValue={setDescription}
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "0.8rem", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <div
            className={styles.folderFooter}
            style={{ justifyContent: "flex-end" }}
          >
            <SubmitButton
              type="submit"
              disabled={loading}
              text={loading ? "Updating..." : "Update"}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPostModal;
