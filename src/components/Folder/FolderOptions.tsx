import React from "react";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import styles from "../../pages/Board/Board.module.css";

interface FolderOptionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const FolderOptions = ({ onEdit, onDelete }: FolderOptionsProps) => {
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
        <EllipsisVertical size={20} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
          >
            <Pencil size={14} /> Editar
          </button>
          <button
            className={styles.deleteBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      )}
    </div>
  );
};

export default FolderOptions;
