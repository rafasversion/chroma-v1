import React from "react";
import styles from "./PostModal.module.css";
import { ImagePlus, FolderPlus } from "lucide-react";

interface SelectViewProps {
  setView: (view: "photo" | "folder") => void;
}

const SelectView = ({ setView }: SelectViewProps) => {
  return (
    <div className={styles.selectView}>
      <h2>Choose what you want to create:</h2>
      <div className={styles.optionsContainer}>
        <button className={styles.optionBtn} onClick={() => setView("photo")}>
          <ImagePlus size={50} />
          <span>Post</span>
        </button>
        <button className={styles.optionBtn} onClick={() => setView("folder")}>
          <FolderPlus size={50} />
          <span>Folder</span>
        </button>
      </div>
    </div>
  );
};

export default SelectView;
