import React from "react";
import styles from "../../pages/Board/Board.module.css";

type TabType = "folders" | "posts" | "likes";

interface TabNavigationProps {
  activeTab: TabType;
  isOwnProfile: boolean;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation = ({
  activeTab,
  isOwnProfile,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <header className={styles.headerProfile}>
      <nav className={styles.tabNav}>
        <button
          className={activeTab === "folders" ? styles.activeTab : ""}
          onClick={() => onTabChange("folders")}
        >
          Folders
        </button>
        <button
          className={activeTab === "posts" ? styles.activeTab : ""}
          onClick={() => onTabChange("posts")}
        >
          Posts
        </button>
        {isOwnProfile && (
          <button
            className={activeTab === "likes" ? styles.activeTab : ""}
            onClick={() => onTabChange("likes")}
          >
            Likes
          </button>
        )}
      </nav>
    </header>
  );
};

export default TabNavigation;
