import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import logoBlack from "../../assets/logo-black.svg";
import { LogIn } from "lucide-react";
import CreateContentModal from "../CreateContent/CreateContentModal";
import { UserContext } from "../../contexts/UserContext";
import SearchBar from "./SearchBar";
import NavigationLinks from "./NavigationLinks";
import UserMenu from "./UserMenu";
import NotificationBell from "./Notifications";
import MobileNav from "./MobileNav";
import ScrollTopButton from "./ScrollTopButton";
import {
  getNotificationsService,
  markNotificationsAsReadService,
} from "../../services/notificationService";
import type { NotificationAPI } from "../../types/notificationApi";

const Header = () => {
  const { isLogged, logoutAction, username } = React.useContext(UserContext);
  const [modalPost, setModalPost] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationAPI[]>(
    [],
  );
  const [unread, setUnread] = React.useState(0);

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  async function fetchNotifications() {
    const data = await getNotificationsService();
    if (data) {
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    }
  }

  async function markAsRead() {
    await markNotificationsAsReadService();
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
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLogged]);

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
            {isLogged && <SearchBar scrolled={scrolled} />}
            <div className={styles.content}>
              <NavigationLinks
                isLogged={isLogged}
                scrolled={scrolled}
                onOpenPost={() => setModalPost(true)}
                username={username}
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

      {!isAuthPage && isLogged && <SearchBar mobile={true} />}
      {scrolled && !isAuthPage && <ScrollTopButton />}
      {isLogged && (
        <MobileNav
          isLogged={isLogged}
          logoutAction={logoutAction}
          onOpenPost={() => setModalPost(true)}
          username={username}
          notifications={notifications}
          unread={unread}
          markAsRead={markAsRead}
        />
      )}

      {modalPost && (
        <CreateContentModal
          setModal={setModalPost}
          onUpdate={async (type?: "post" | "folder") => {
            const path = window.location.pathname;
            if (type === "folder" && !path.startsWith("/board")) {
              window.location.href = `/board/${username}/folders`;
            } else if (path === "/") {
              window.dispatchEvent(new CustomEvent("refreshFeed"));
            } else if (path.startsWith("/board")) {
              window.dispatchEvent(new CustomEvent("refreshBoard"));
            }
          }}
        />
      )}
    </>
  );
};

export default Header;
