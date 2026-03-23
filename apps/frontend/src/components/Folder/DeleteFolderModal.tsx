import React from "react";
import styles from "./DeleteFolderModal.module.css";
import type { FolderAPI } from "../../types/folderApi";
import SubmitButton from "../../components/Form/Button/SubmitButton";

interface DeleteFolderModalProps {
  folder: FolderAPI;
  onClose: () => void;
  onConfirm: (folderId: number) => void;
  loading?: boolean;
}

const DeleteFolderModal = ({
  folder,
  onClose,
  onConfirm,
  loading,
}: DeleteFolderModalProps) => {
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
          <h2>Delete this board?</h2>
          <p>
            The board <strong>{folder.title}</strong> and all its pins will be
            removed from your profile. This action is permanent.
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
            <SubmitButton
              type="button"
              text={loading ? "Deleting..." : "Delete"}
              onClick={() => onConfirm(folder.id)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeleteFolderModal;
