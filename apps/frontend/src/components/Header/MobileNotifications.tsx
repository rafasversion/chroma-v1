import React from "react";
import { NavLink } from "react-router-dom";
import { Bell, User } from "lucide-react";
import styles from "./Header.module.css";
import type { NotificationAPI } from "../../types/notificationApi";

function notifText(n: NotificationAPI): string {
  switch (n.type) {
    case "like":
      return "liked your post";
    case "comment":
      return "commented on your post";
    case "reply":
      return "replied to your comment";
    case "comment_like":
      return "liked your comment";
    default:
      return "interacted with you";
  }
}

interface MobileNotificationsProps {
  notifications: NotificationAPI[];
  unread: number;
  markAsRead: () => void;
}

const MobileNotifications = ({
  notifications,
  unread,
  markAsRead,
}: MobileNotificationsProps) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (!open && unread > 0) markAsRead();
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className={styles.mobileNavBtn} onClick={handleOpen}>
        <Bell size={24} strokeWidth={2} />
        {unread > 0 && <span className={styles.mobileNotifDot} />}
      </button>
      {open && (
        <div className={styles.mobileNotifDropdown}>
          <p className={styles.notifTitle}>Notifications</p>
          {notifications.length === 0 ? (
            <p className={styles.notifEmpty}>No notifications.</p>
          ) : (
            notifications.map((n) => (
              <NavLink
                key={n.id}
                to={n.post_id ? `/photo/${n.post_id}` : "#"}
                className={`${styles.notifItem} ${!n.is_read ? styles.notifUnread : ""}`}
                onClick={() => setOpen(false)}
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
                  <strong>@{n.from_user}</strong> {notifText(n)}
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
