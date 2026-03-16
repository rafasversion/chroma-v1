import React from "react";
import styles from "./NotLoggedProfile.module.css";
import { Link } from "react-router-dom";

const NotLoggedProfile = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Welcome to Chroma</h2>
        <p>You need to be logged in to view this.</p>

        <div className={styles.actions}>
          <Link to="/login">
            <button className={styles.loginBtn}>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotLoggedProfile;
