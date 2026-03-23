import React from "react";
import styles from "../../pages/Login/Login.module.css";
import { Link } from "react-router-dom";
import photo from "../../assets/photo-login.jpg";
import fullLogo from "../../assets/full-logo-black.svg";

const PasswordLost = () => {
  const [login, setLogin] = React.useState("");
  const [serverError, setServerError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!login.trim()) {
      setServerError("Please enter your email or username.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/password/lost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Check your email for password reset instructions.");
      } else {
        setServerError(data.error || "Error sending password reset email.");
      }
    } catch (err) {
      console.error(err);
      setServerError("Error connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.containerLogin}>
      <img src={photo} alt="Photos" />
      <div className={styles.form}>
        <img className={styles.logo} src={fullLogo} alt="Logo Chroma" />
        <h2
          style={{ fontSize: "1.25rem", marginBottom: "20px", color: "#000" }}
        >
          Forgot Your Password?
        </h2>

        {successMessage ? (
          <div style={{ color: "#4caf50", textAlign: "center" }}>
            <p style={{ marginBottom: "20px" }}>
              <i className="fa-solid fa-check-circle" /> {successMessage}
            </p>
            <Link
              to="/login"
              style={{ color: "#333", textDecoration: "underline" }}
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#666",
                marginBottom: "20px",
              }}
            >
              Enter your email or username and we'll send you a link to reset
              your password.
            </p>

            <input
              className={styles.submitLogin}
              style={{
                background: "#f5f5f5",
                color: "#333",
                marginBottom: "1rem",
                padding: "0.8rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                width: "100%",
                fontSize: "1rem",
              }}
              type="text"
              placeholder="Enter your email or username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              disabled={isLoading}
            />

            {serverError && (
              <div style={{ color: "#d32f2f", marginBottom: "16px" }}>
                <i className="fa-solid fa-circle-exclamation" /> {serverError}
              </div>
            )}

            <button
              className={styles.submitLogin}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className={styles.redirect}>
              Remember your password? <Link to="/login">Login here.</Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default PasswordLost;
