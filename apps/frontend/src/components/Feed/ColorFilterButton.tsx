import React from "react";
import { Palette } from "lucide-react";
import styles from "../../pages/Feed/Feed.module.css";

interface ColorFilterButtonProps {
  selectedColor: string | null;
  onOpenModal: () => void;
}

const ColorFilterButton: React.FC<ColorFilterButtonProps> = ({
  selectedColor,
  onOpenModal,
}) => {
  return (
    <div className={styles.colorFilter}>
      <Palette size={20} onClick={onOpenModal} style={{ cursor: "pointer" }} />
      {selectedColor && (
        <div
          className={styles.activeColorDot}
          style={{ backgroundColor: `rgb(${selectedColor})` }}
          onClick={onOpenModal}
        />
      )}
    </div>
  );
};

export default ColorFilterButton;
