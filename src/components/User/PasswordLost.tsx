import React from "react";
import styles from "../../pages/Login/Login.module.css";
import { Link } from "react-router-dom";
import photo from "../../assets/photo-login.jpg";
import fullLogo from "../../assets/full-logo-black.svg";
import Input from "../Form/Input/Input";
import { useForm } from "../../hooks/useForm";

interface PasswordLostFormType {
  login: string;
}

const PasswordLost = () => {
  const [serverError, setServerError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { form, error, handleChange, validateAll, onBlur, clearErrors } =
    useForm<PasswordLostFormType>(
      {
        login: "",
      },
      {
        login: false,
      },
    );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearErrors();
    setServerError("");
    setSuccessMessage("");

    if (!form.login.trim()) {
      setServerError("Please enter your email or username.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://chroma-api.test/json/api/password/lost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: form.login,
            url: `${window.location.origin}/password-reset`,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Check your email for password reset instructions.");
      } else {
        setServerError(data.message || "Error sending password reset email.");
      }
    } catch (err) {
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
              <i className="fa-solid fa-check-circle"></i> {successMessage}
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

            <Input
              id="login"
              type="text"
              label="Email or Username"
              placeholder="Enter your email or username"
              value={form.login}
              setValue={handleChange("login")}
              disabled={isLoading}
            />

            {serverError && (
              <div style={{ color: "#d32f2f", marginBottom: "16px" }}>
                <i className="fa-solid fa-circle-exclamation"></i> {serverError}
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
