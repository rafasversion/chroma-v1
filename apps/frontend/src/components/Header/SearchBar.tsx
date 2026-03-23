import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import styles from "./Header.module.css";

interface SearchBarProps {
  scrolled?: boolean;
  mobile?: boolean;
}

const SearchBar = ({ scrolled = false, mobile = false }: SearchBarProps) => {
  const [searchExpanded, setSearchExpanded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchExpanded(false);
    }
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        scrolled
      ) {
        setSearchExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [scrolled]);

  if (mobile) {
    return (
      <div className={styles.mobileSearchBar}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
      </div>
    );
  }

  const toggleSearch = () => {
    if (scrolled) setSearchExpanded(!searchExpanded);
  };

  return (
    <div
      className={`${styles.searchWrapper} ${scrolled ? styles.searchWrapperScrolled : ""}`}
      ref={searchRef}
    >
      {scrolled ? (
        searchExpanded ? (
          <input
            type="text"
            placeholder="Search"
            className={`${styles.searchInput} ${styles.searchInputScrolled}`}
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        ) : (
          <button
            className={`${styles.searchIconButton} ${styles.searchIconButtonScrolled}`}
            onClick={toggleSearch}
          >
            <Search size={20} strokeWidth={2} />
          </button>
        )
      ) : (
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
      )}
    </div>
  );
};

export default SearchBar;
