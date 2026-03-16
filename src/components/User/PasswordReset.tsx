import React from "react";
import styles from "../../pages/Login/Login.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import photo from "../../assets/photo-login.jpg";
import fullLogo from "../../assets/full-logo-black.svg";
import Input from "../../components/Form/Input/Input";
import { useForm } from "../../hooks/useForm";

interface PasswordResetFormType {
  password: string;
}

const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [invalidToken, setInvalidToken] = React.useState(false);

  const key = searchParams.get("key");
  const login = searchParams.get("login");

  React.useEffect(() => {
    if (!key || !login) {
      setInvalidToken(true);
    }
  }, [key, login]);

  const { form, error, handleChange, validateAll, onBlur, clearErrors } =
    useForm<PasswordResetFormType>(
      {
        password: "",
      },
      {
        password: "password",
      },
    );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearErrors();
    setServerError("");
    setSuccessMessage("");

    if (!validateAll()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://chroma-api.test/json/api/password/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login,
            key,
            password: form.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerError(
          data.message || "Error resetting password. Token may have expired.",
        );
      }
    } catch (err) {
      setServerError("Error connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  if (invalidToken) {
    return (
      <section className={styles.containerLogin}>
        <img src={photo} alt="Photos" />
        <div className={styles.form}>
          <img className={styles.logo} src={fullLogo} alt="Logo Chroma" />
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "20px",
              color: "#d32f2f",
            }}
          >
            Invalid Link
          </h2>
          <p style={{ marginBottom: "20px", color: "#666" }}>
            The password reset link is invalid or has expired.
          </p>
          <Link
            to="/password-lost"
            style={{ color: "#333", textDecoration: "underline" }}
          >
            Request a new reset link
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.containerLogin}>
      <img src={photo} alt="Photos" />
      <div className={styles.form}>
        <img className={styles.logo} src={fullLogo} alt="Logo Chroma" />

        <h2
          style={{ fontSize: "1.25rem", marginBottom: "20px", color: "#000" }}
        >
          Reset Your Password
        </h2>

        {successMessage ? (
          <div style={{ color: "#4caf50", textAlign: "center" }}>
            <p style={{ marginBottom: "20px" }}>
              <i className="fa-solid fa-check-circle"></i> {successMessage}
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              id="password"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              value={form.password}
              setValue={handleChange("password")}
              onBlur={onBlur("password")}
              disabled={isLoading}
            />
            {error("password") && (
              <p
                style={{
                  color: "#d32f2f",
                  fontSize: "0.85rem",
                  marginTop: "-10px",
                  marginBottom: "12px",
                }}
              >
                <i className="fa-solid fa-circle-exclamation"></i>{" "}
                {error("password")}
              </p>
            )}

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
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <p className={styles.redirect}>
              <Link to="/login">Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default PasswordReset;
