import React from "react";
import { Ellipsis, Pencil, Trash2, FolderMinus } from "lucide-react";
import styles from "./PhotoOptions.module.css";

interface PhotoOptionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onRemoveFromFolder?: () => void;
}

const PhotoOptions = ({
  onEdit,
  onDelete,
  onRemoveFromFolder,
}: PhotoOptionsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.optionsWrapper} ref={menuRef}>
      <button
        className={styles.optionsBtn}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Ellipsis size={20} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
                setIsOpen(false);
              }}
            >
              <Pencil size={14} /> Edit
            </button>
          )}
          {onDelete && (
            <button
              className={styles.deleteBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
                setIsOpen(false);
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
          {onRemoveFromFolder && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveFromFolder();
                setIsOpen(false);
              }}
            >
              <FolderMinus size={14} /> Remove from folder
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoOptions;
