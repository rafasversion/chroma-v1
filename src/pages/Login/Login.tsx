import React from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import photo from "../../assets/photo-login.jpg";
import fullLogo from "../../assets/full-logo-black.svg";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../../contexts/UserContext";
import Input from "../../components/Form/Input/Input";
import { authService } from "../../services/authService";
import { useForm } from "../../hooks/useForm";
import type { CredentialResponse } from "@react-oauth/google";

interface LoginFormType {
  username: string;
  password: string;
}

const Login = () => {
  const { loginAction } = React.useContext(UserContext);
  const [serverError, setServerError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { form, error, handleChange, validateAll, onBlur, clearErrors } =
    useForm<LoginFormType>(
      {
        username: "",
        password: "",
      },
      {
        username: "username",
        password: "password",
      },
    );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearErrors();
    setServerError("");

    if (!validateAll()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res && res.token) {
        loginAction(res.token);
        window.location.href = "/";
      } else {
        setServerError("Incorrect username or password.");
      }
    } catch (err) {
      setServerError("Error connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setServerError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://chroma-api.test/json/v1/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (data.token) {
        loginAction(data.token);
        window.location.href = "/";
      } else {
        setServerError("Error logging in with Google.");
      }
    } catch (err) {
      setServerError("Error connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.containerLogin}>
      <img src={photo} alt="Photos" />
      <div className={styles.form}>
        <img className={styles.logo} src={fullLogo} alt="Logo Chroma" />
        <form onSubmit={handleSubmit} style={{ width: "420px" }}>
          <Input
            id="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={form.username}
            setValue={handleChange("username")}
            onBlur={onBlur("username")}
            disabled={isLoading}
          />
          {error("username") && (
            <p
              style={{
                color: "#d32f2f",
                fontSize: "0.85rem",
                marginTop: "-10px",
                marginBottom: "12px",
              }}
            >
              <i className="fa-solid fa-circle-exclamation"></i>{" "}
              {error("username")}
            </p>
          )}

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
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
            <div className={styles.errorContainer}>
              <span>
                <i className="fa-solid fa-circle-exclamation"></i> {serverError}
              </span>
            </div>
          )}

          <div className={styles.formHelper}>
            <label htmlFor="remember">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                defaultChecked
                disabled={isLoading}
              />
              Remember me
            </label>
            <Link to="/password-lost">
              <span>Forgot Password?</span>
            </Link>
          </div>

          <button
            className={styles.submitLogin}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <span className={styles.continue}>or continue</span>

          <div className={styles.googleWrapper}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {}}
              width="400"
              shape="rectangular"
              theme="outline"
            />
          </div>

          <p className={styles.redirect}>
            Don't have an account? <Link to="/register">Sign Up.</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
