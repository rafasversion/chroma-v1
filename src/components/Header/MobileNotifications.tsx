import React from "react";
import { NavLink } from "react-router-dom";
import { Bell, User } from "lucide-react";
import styles from "./Header.module.css";

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

interface MobileNotificationsProps {
  notifications: Notification[];
  unread: number;
  markAsRead: () => void;
}

const MobileNotifications = ({
  notifications,
  unread,
  markAsRead,
}: MobileNotificationsProps) => {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const mobileNotifRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileNotifRef.current &&
        !mobileNotifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifOpen = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen && unread > 0) markAsRead();
  };

  return (
    <div style={{ position: "relative" }} ref={mobileNotifRef}>
      <button className={styles.mobileNavBtn} onClick={handleNotifOpen}>
        <Bell size={24} strokeWidth={2} />
        {unread > 0 && <span className={styles.mobileNotifDot} />}
      </button>

      {notifOpen && (
        <div className={styles.mobileNotifDropdown}>
          <p className={styles.notifTitle}>Notifications</p>
          {notifications.length === 0 ? (
            <p className={styles.notifEmpty}>No notifications.</p>
          ) : (
            notifications.map((n) => (
              <NavLink
                key={n.id}
                to={`/photo/${n.post_id}`}
                className={`${styles.notifItem} ${!n.is_read ? styles.notifUnread : ""}`}
                onClick={() => setNotifOpen(false)}
              >
                {n.from_picture ? (
                  <img
                    src={n.from_picture}
                    className={styles.notifAvatar}
                    alt={n.from_user}
                  />
                ) : (
                  <div className={styles.notifAvatarFallback}>
                    <User size={14} />
                  </div>
                )}
                <span className={styles.notifText}>
                  <strong>@{n.from_user}</strong>{" "}
                  {n.type === "like" ? "liked" : "commented on"}{" "}
                  <strong>{n.post_title}</strong>
                </span>
              </NavLink>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNotifications;
