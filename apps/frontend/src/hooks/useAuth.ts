import React from "react";
import { tokenValidate } from "../services/authService";

export const useAuth = () => {
  const [isLogged, setIsLogged] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function validate() {
      const token = window.localStorage.getItem("token");

      if (!token) {
        setIsLogged(false);
        setIsLoading(false);
        return;
      }

      const isValid = await tokenValidate(token);
      setIsLogged(!!isValid);
      setIsLoading(false);
    }

    validate();
  }, []);

  return { isLogged, isLoading };
};