import React from "react";
import styles from "../Folder/DeleteFolderModal.module.css";
import type { PhotoAPI } from "../../types/photoApi";

interface DeletePhotoModalProps {
  photo: PhotoAPI;
  onClose: () => void;
  onConfirm: (folderId: number) => void;
  loading?: boolean;
}

const DeletePhotoModal = ({
  photo,
  onClose,
  onConfirm,
  loading,
}: DeletePhotoModalProps) => {
  return (
    <section className={styles.postModal} onClick={onClose}>
      <div
        className={`${styles.postModalContent} ${styles.isSelectView}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeModalPost} onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className={styles.selectView}>
          <h2>Delete this post?</h2>

          <p>
            The post <strong>{photo.title}</strong> will be removed from your
            profile. This action is permanent.
          </p>

          <div className={styles.optionsContainer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.submitPost}
              onClick={() => onConfirm(photo.id)}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeletePhotoModal;
