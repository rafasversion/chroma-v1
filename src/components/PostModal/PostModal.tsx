import React from "react";
import styles from "./PostModal.module.css";
import SelectView from "./SelectView";
import PhotoForm from "./PhotoForm";
import FolderForm from "./FolderForm";

interface PostModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostModal = ({ setModal }: PostModalProps) => {
  const [view, setView] = React.useState<"select" | "photo" | "folder">(
    "select",
  );

  return (
    <section className={styles.postModal}>
      <div
        className={`${styles.postModalContent} ${
          view === "select" ? styles.isSelectView : ""
        }`}
      >
        <button className={styles.closeModal} onClick={() => setModal(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {view === "select" && <SelectView setView={setView} />}
        {view === "photo" && (
          <PhotoForm handleBack={() => setView("select")} setModal={setModal} />
        )}
        {view === "folder" && (
          <FolderForm
            handleBack={() => setView("select")}
            setModal={setModal}
          />
        )}
      </div>
    </section>
  );
};

export default PostModal;
