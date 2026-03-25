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

interface NotificationsProps {
  unread: number;
  notifications: NotificationAPI[];
  markAsRead: () => void;
  scrolled?: boolean;
}

const Notifications = ({
  unread,
  notifications,
  markAsRead,
  scrolled = false,
}: NotificationsProps) => {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
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
    <div className={styles.notifWrapper} ref={notifRef}>
      <button
        className={`${styles.link} ${scrolled ? styles.linkScrolled : ""}`}
        onClick={handleNotifOpen}
      >
        <Bell size={scrolled ? 22 : 24} strokeWidth={2} />
        {unread > 0 && (
          <span className={styles.notifBadge}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {notifOpen && (
        <div className={styles.notifDropdown}>
          <p className={styles.notifTitle}>Notifications</p>
          {notifications.length === 0 ? (
            <p className={styles.notifEmpty}>No notifications.</p>
          ) : (
            notifications.map((n) => (
              <NavLink
                key={n.id}
                to={n.post_id ? `/post/${n.post_id}` : "#"}
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
                  <strong>@{n.from_user}</strong> {notifText(n)}
                  {n.post_title && (
                    <>
                      {" "}
                      — <strong>{n.post_title}</strong>
                    </>
                  )}
                </span>
              </NavLink>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
