import React from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, PlusSquare, User, Bell, LogIn } from "lucide-react";
import styles from "./Header.module.css";
import MobileNotificationMenu from "./MobileNotifications";
import MobileUserMenu from "./MobileUserMenu";

interface Notification {
  id: string;
  type: "like" | "comment";
  is_read: boolean;
  created_at: string;
  post_id: number;
  post_title: string;
  from_user: string;
  from_picture: string;
}

interface MobileNavProps {
  isLogged: boolean;
  logoutAction: () => void;
  onOpenPost: () => void;
  notifications: Notification[];
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
