import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import logoBlack from "../../assets/logo-black.svg";
import { LogIn } from "lucide-react";
import PostModal from "../../components/PostModal/PostModal.tsx";
import { UserContext } from "../../contexts/UserContext";

import SearchBar from "./SearchBar";
import NavigationLinks from "./NavigationLinks";
import UserMenu from "./UserMenu";
import NotificationBell from "./Notifications";
import MobileNav from "./MobileNav";
import ScrollTopButton from "./ScrollTopButton";

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

const Header = () => {
  const { isLogged, logoutAction } = React.useContext(UserContext);
  const [modalPost, setModalPost] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unread, setUnread] = React.useState(0);

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  async function fetchNotifications() {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://chroma-api.test/json/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotifications(data.notifications || []);
    setUnread(data.unread || 0);
  }

  async function markAsRead() {
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch("http://chroma-api.test/json/api/notifications/read", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  React.useEffect(() => {
    if (!isLogged) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isLogged]);

  React.useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
      >
        <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
          <NavLink to="/" end>
            <img
              src={logoBlack}
              alt="Chroma Logo"
              className={scrolled ? styles.logoScrolled : styles.logo}
            />
          </NavLink>

          <div className={styles.rightSide}>
            <SearchBar scrolled={scrolled} />

            <div className={styles.content}>
              <NavigationLinks
                isLogged={isLogged}
                scrolled={scrolled}
                onOpenPost={() => setModalPost(true)}
              />

              {isLogged && (
                <NotificationBell
                  unread={unread}
                  notifications={notifications}
                  markAsRead={markAsRead}
                  scrolled={scrolled}
                />
              )}

              {isLogged ? (
                <UserMenu scrolled={scrolled} logoutAction={logoutAction} />
              ) : (
                <NavLink
                  className={`${styles.loginButton} ${scrolled ? styles.loginButtonScrolled : ""}`}
                  to="/login"
                >
                  Sign In <LogIn size={scrolled ? 18 : 20} strokeWidth={2} />
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      </header>

      {!isAuthPage && <SearchBar mobile={true} />}
      {scrolled && !isAuthPage && <ScrollTopButton />}
      <MobileNav
        isLogged={isLogged}
        logoutAction={logoutAction}
        onOpenPost={() => setModalPost(true)}
        notifications={notifications}
        unread={unread}
        markAsRead={markAsRead}
      />

      {modalPost && <PostModal setModal={setModalPost} />}
    </>
  );
};

export default Header;
