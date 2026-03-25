import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import styles from "./Header.module.css";
import { UserContext } from "../../contexts/UserContext";

interface UserMenuProps {
  scrolled?: boolean;
  logoutAction: () => void;
}

const UserMenu = ({ scrolled = false, logoutAction }: UserMenuProps) => {
  const { username } = React.useContext(UserContext);
  const [dropdown, setDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

    if (window.location.pathname === "/") {
      window.dispatchEvent(new CustomEvent("refreshFeed"));
    } else {
      navigate("/", { replace: true });
    }
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
            <NavLink
              to={`/board/${username}/folders`}
              onClick={() => setDropdown(false)}
            >
              Profile
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
