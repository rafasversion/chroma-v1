import React from "react";
import styles from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import photo from "../../assets/photo-register.jpg";
import fullLogo from "../../assets/full-logo-black.svg";
import { registerUserService } from "../../services/registerUserService";
import Input from "../../components/Form/Input/Input";
import { useForm } from "../../hooks/useForm";

interface RegisterFormType {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { form, error, handleChange, validateAll, onBlur, clearErrors } =
    useForm<RegisterFormType>(
      {
        username: "",
        email: "",
        password: "",
      },
      {
        username: "username",
        email: "email",
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
      const res = await registerUserService(form);

      if (res && res.id) {
        navigate("/login");
      } else {
        setServerError("Incorrect data or user already exists.");
      }
    } catch (err) {
      setServerError(
        "An internal error occurred. Please wait a moment and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.containerRegister}>
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
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            setValue={handleChange("email")}
            onBlur={onBlur("email")}
            disabled={isLoading}
          />
          {error("email") && (
            <p
              style={{
                color: "#d32f2f",
                fontSize: "0.85rem",
                marginTop: "-10px",
                marginBottom: "12px",
              }}
            >
              <i className="fa-solid fa-circle-exclamation"></i>{" "}
              {error("email")}
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
            <div style={{ color: "#d32f2f", marginBottom: "16px" }}>
              <i className="fa-solid fa-circle-exclamation"></i> {serverError}
            </div>
          )}

          <button
            className={styles.submitRegister}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p className={styles.redirect}>
            Already have an account? <Link to="/login">Login here.</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
