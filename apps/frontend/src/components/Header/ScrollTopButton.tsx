import React from "react";
import { ArrowUp } from "lucide-react";
import styles from "./Header.module.css";

const ScrollTopButton = () => {
  return (
    <button
      className={styles.scrollTopBtn}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollTopButton;
