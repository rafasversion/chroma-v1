import React from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, PlusSquare } from "lucide-react";
import styles from "./Header.module.css";

interface NavigationLinksProps {
  isLogged: boolean;
  scrolled?: boolean;
  onOpenPost: () => void;
  username: string;
}

const NavigationLinks = ({
  isLogged,
  scrolled = false,
  onOpenPost,
  username,
}: NavigationLinksProps) => {
  return (
    <>
      <NavLink
        className={`${styles.link} ${scrolled ? styles.linkScrolled : ""}`}
        to="/"
        end
      >
        <Home size={scrolled ? 22 : 24} strokeWidth={2} />
      </NavLink>
      {isLogged && (
        <>
          <NavLink
            className={`${styles.link} ${scrolled ? styles.linkScrolled : ""}`}
            to={`/board/${username}/folders`}
          >
            <LayoutGrid size={scrolled ? 22 : 24} strokeWidth={2} />
          </NavLink>
          <button
            className={`${styles.link} ${scrolled ? styles.linkScrolled : ""}`}
            onClick={onOpenPost}
          >
            <PlusSquare size={scrolled ? 22 : 24} strokeWidth={2} />
          </button>
        </>
      )}
    </>
  );
};

export default NavigationLinks;
