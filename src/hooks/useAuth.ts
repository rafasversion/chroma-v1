import React from "react";
import { tokenValidate } from "../services/authService";

export const useAuth = (): boolean => {
  const [isLogged, setIsLogged] = React.useState(false);

  React.useEffect(() => {
    async function validate() {
      const token = window.localStorage.getItem("token");
      if (token) {
        const isValid = await tokenValidate(token);
        if (isValid) setIsLogged(true);
      }
    }
    validate();
  }, []);

  return isLogged;
};