import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import styles from "./Header.module.css";

interface MobileUserMenuProps {
  logoutAction: () => void;
}

const MobileUserMenu = ({ logoutAction }: MobileUserMenuProps) => {
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={mobileMenuRef}>
      <button
        className={styles.mobileNavBtn}
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        <User size={24} strokeWidth={2} />
      </button>

      {mobileMenu && (
        <ul className={styles.mobileUserMenu}>
          <li>
            <NavLink to="/board" onClick={() => setMobileMenu(false)}>
              Profile
            </NavLink>
          </li>
          <li>
            <button
              onClick={() => {
                logoutAction();
                setMobileMenu(false);
              }}
              className={styles.logoutBtn}
            >
              Sair
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MobileUserMenu;
