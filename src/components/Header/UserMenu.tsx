import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import styles from "./Header.module.css";

interface UserMenuProps {
  scrolled?: boolean;
  logoutAction: () => void;
}

const UserMenu = ({ scrolled = false, logoutAction }: UserMenuProps) => {
  const [dropdown, setDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutAction();
    setDropdown(false);
  };

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <button
        className={`${styles.link} ${scrolled ? styles.linkScrolled : ""}`}
        onClick={() => setDropdown(!dropdown)}
      >
        <User size={scrolled ? 22 : 24} strokeWidth={2} />
      </button>

      {dropdown && (
        <ul
          className={`${styles.dropdownMenu} ${scrolled ? styles.dropdownMenuScrolled : ""}`}
        >
          <li>
            <NavLink to="/board" onClick={() => setDropdown(false)}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/perfil" onClick={() => setDropdown(false)}>
              Settings
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Sair
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
