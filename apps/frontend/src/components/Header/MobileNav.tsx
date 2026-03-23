import React from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, PlusSquare, LogIn } from "lucide-react";
import styles from "./Header.module.css";
import MobileNotificationMenu from "./MobileNotifications";
import MobileUserMenu from "./MobileUserMenu";
import type { NotificationAPI } from "../../types/notificationApi";

interface MobileNavProps {
  isLogged: boolean;
  logoutAction: () => void;
  onOpenPost: () => void;
  notifications: NotificationAPI[];
  unread: number;
  markAsRead: () => void;
}

const MobileNav = ({
  isLogged,
  logoutAction,
  onOpenPost,
  notifications,
  unread,
  markAsRead,
}: MobileNavProps) => {
  return (
    <nav className={styles.mobileNav}>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${styles.mobileNavBtn} ${isActive ? styles.active : ""}`
        }
      >
        <Home size={24} strokeWidth={2} />
      </NavLink>

      {isLogged && (
        <NavLink
          to="/board"
          className={({ isActive }) =>
            `${styles.mobileNavBtn} ${isActive ? styles.active : ""}`
          }
        >
          <LayoutGrid size={24} strokeWidth={2} />
        </NavLink>
      )}

      {isLogged && (
        <button className={styles.mobileNavPlus} onClick={onOpenPost}>
          <PlusSquare size={24} strokeWidth={2} />
        </button>
      )}

      {isLogged && (
        <MobileNotificationMenu
          notifications={notifications}
          unread={unread}
          markAsRead={markAsRead}
        />
      )}

      {isLogged ? (
        <MobileUserMenu logoutAction={logoutAction} />
      ) : (
        <NavLink to="/login" className={styles.mobileNavBtn}>
          <LogIn size={24} strokeWidth={2} />
        </NavLink>
      )}
    </nav>
  );
};

export default MobileNav;
