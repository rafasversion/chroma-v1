import React from "react";
import styles from "./CreateContentModal.module.css";
import SelectView from "./SelectView";
import PostForm from "./PostForm";
import FolderForm from "./FolderForm";

interface PostModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostModal = ({ setModal }: PostModalProps) => {
  const [view, setView] = React.useState<"select" | "post" | "folder">(
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
        {view === "post" && (
          <PostForm handleBack={() => setView("select")} setModal={setModal} />
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
