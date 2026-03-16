import React from "react";
import { Palette, X } from "lucide-react";
import styles from "../../pages/Feed/Feed.module.css";

const PRESET_COLORS = [
  "#e63946",
  "#f4845f",
  "#f7b731",
  "#2ecc71",
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#e91e8c",
  "#ffffff",
  "#b0b0b0",
  "#555555",
  "#1a1a1a",
  "#c0392b",
  "#d35400",
  "#f39c12",
  "#27ae60",
];

interface ColorFilterModalProps {
  isOpen: boolean;
  pickerColor: string;
  selectedColor: string | null;
  onColorChange: (color: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

const ColorFilterModal: React.FC<ColorFilterModalProps> = ({
  isOpen,
  pickerColor,
  selectedColor,
  onColorChange,
  onApply,
  onClear,
  onClose,
}) => {
  const customColorRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className={styles.colorModalOverlay} onClick={onClose}>
      <div
        className={styles.colorModalBox}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.colorModalHeader}>
          <span>Filter by color</span>
          <X size={16} onClick={onClose} style={{ cursor: "pointer" }} />
        </div>

        <div className={styles.colorGrid}>
          {PRESET_COLORS.map((color) => (
            <div
              key={color}
              className={`${styles.colorSwatch} ${
                pickerColor === color ? styles.active : ""
              }`}
              style={{
                backgroundColor: color,
                boxShadow:
                  color === "#ffffff" ? "inset 0 0 0 1px #ddd" : "none",
              }}
              onClick={() => onColorChange(color)}
            />
          ))}
          <div
            className={styles.customColorBtn}
            onClick={() => customColorRef.current?.click()}
          >
            <Palette size={14} color="#888" />
          </div>
          <input
            ref={customColorRef}
            type="color"
            value={pickerColor}
            onChange={(e) => onColorChange(e.target.value)}
            style={{ display: "none" }}
          />
        </div>

        <div
          className={styles.colorPreview}
          style={{ backgroundColor: pickerColor }}
        />

        <div className={styles.colorModalActions}>
          {selectedColor && (
            <button className={styles.clearBtn} onClick={onClear}>
              Clear
            </button>
          )}
          <button className={styles.applyBtn} onClick={onApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorFilterModal;
