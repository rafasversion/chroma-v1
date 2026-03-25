import React from "react";
import styles from "./CreateContentModal.module.css";
import SelectView from "./SelectView";
import PostForm from "./PostForm";
import FolderForm from "./FolderForm";

interface CreateContentModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: (type?: "post" | "folder") => Promise<void>;
}

const CreateContentModal = ({
  setModal,
  onUpdate,
}: CreateContentModalProps) => {
  const [view, setView] = React.useState<"select" | "post" | "folder">(
    "select",
  );

  const getTitle = () => {
    if (view === "post") return "Create Post";
    if (view === "folder") return "Create Folder";
    return "";
  };

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

        {view !== "select" && (
          <h2 className={styles.modalTitle}>{getTitle()}</h2>
        )}

        {view === "select" && <SelectView setView={setView} />}
        {view === "post" && (
          <PostForm
            handleBack={() => setView("select")}
            setModal={setModal}
            onUpdate={() => onUpdate("post")}
          />
        )}
        {view === "folder" && (
          <FolderForm
            handleBack={() => setView("select")}
            setModal={setModal}
            onUpdate={() => onUpdate("folder")}
          />
        )}
      </div>
    </section>
  );
};

export default CreateContentModal;
