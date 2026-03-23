import React from "react";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import photo from "../../assets/photo-login.jpg";
import fullLogo from "../../assets/full-logo-black.svg";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../../contexts/UserContext";
import Input from "../../components/Form/Input/Input";
import { authService, googleLoginService } from "../../services/authService";
import { useForm } from "../../hooks/useForm";
import type { CredentialResponse } from "@react-oauth/google";

interface LoginFormType {
  login: string;
  password: string;
  [key: string]: string;
}

const Login = () => {
  const { loginAction } = React.useContext(UserContext);
  const [serverError, setServerError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { form, error, handleChange, onBlur, clearErrors } =
    useForm<LoginFormType>(
      { login: "", password: "" },
      { login: false, password: "password" },
    );

  const [googleAvailable, setGoogleAvailable] = React.useState(true);

  React.useEffect(() => {
    const ua = navigator.userAgent;
    const isWebView =
      /wv|WebView/i.test(ua) ||
      (ua.includes("Android") && !ua.includes("Chrome")) ||
      (ua.includes("iPhone") && !ua.includes("Safari"));
    if (isWebView) setGoogleAvailable(false);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearErrors();
    setServerError("");

    if (!form.login.trim() || !form.password) {
      setServerError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: form.login, password: form.password }),
      });

      if (res && res.token) {
        loginAction(res.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        setServerError("Incorrect email/username or password.");
      }
    } catch (err) {
      console.error(err);
      setServerError("Error connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setServerError("");
    setIsLoading(true);
    try {
      const payload = JSON.parse(
        atob(credentialResponse.credential!.split(".")[1]),
      );
      const res = await googleLoginService(
        credentialResponse.credential!,
        payload.email,
        payload.email.split("@")[0],
        payload.picture,
      );

      if (res && res.token) {
        await loginAction(res.token);
        window.location.href = "/";
      } else {
        setServerError("Error logging in with Google.");
      }
    } catch (err) {
      console.error(err);
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
            id="login"
            type="text"
            label="Email or Username"
            placeholder="Enter your email or username"
            value={form.login}
            setValue={handleChange("login")}
            disabled={isLoading}
          />

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
              <i className="fa-solid fa-circle-exclamation" />{" "}
              {error("password")}
            </p>
          )}

          {serverError && (
            <div style={{ color: "#d32f2f", marginBottom: "16px" }}>
              <i className="fa-solid fa-circle-exclamation" /> {serverError}
            </div>
          )}

          <div className={styles.formHelper}>
            <label htmlFor="remember">
              <input
                type="checkbox"
                id="remember"
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
            {googleAvailable ? (
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setServerError("Google login failed.")}
                width="480"
                shape="rectangular"
                theme="outline"
              />
            ) : (
              <p
                style={{
                  color: "#888",
                  fontSize: "0.85rem",
                  textAlign: "center",
                }}
              >
                Google login is not available in this browser.
              </p>
            )}
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
