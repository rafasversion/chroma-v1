import React from "react";
import { tokenValidate } from "../services/authService";

export const useAuth = () => {
  const [isLogged, setIsLogged] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const validate = React.useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLogged(false);
      setIsLoading(false);
      return;
    }

    try {
      const isValid = await tokenValidate(token);
      setIsLogged(!!isValid);
    } catch {
      setIsLogged(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    validate();
  }, [validate]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsLogged(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
  };

  return {
    isLogged,
    isLoading,
    login,
    logout,
    validate,
  };
};