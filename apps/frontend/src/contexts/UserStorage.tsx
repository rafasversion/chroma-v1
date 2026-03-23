import React from "react";
import { UserContext } from "./UserContext";
import { tokenValidate } from "../services/authService";
import { userService } from "../services/userService";

export const UserStorage = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = React.useState(false);
  const [username, setUsername] = React.useState("");

  const logoutAction = React.useCallback(() => {
    window.localStorage.removeItem("token");
    setIsLogged(false);
    setUsername("");
  }, []);

  const validateAndFetch = React.useCallback(async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const isValid = await tokenValidate(token);
        if (isValid) {
          setIsLogged(true);
          const userData = await userService();
          if (userData) setUsername(userData.username);
        } else {
          logoutAction();
        }
      } catch {
        logoutAction();
      }
    }
  }, [logoutAction]);

  const loginAction = async (token: string) => {
    window.localStorage.setItem("token", token);
    setIsLogged(true);
    const userData = await userService();
    if (userData) setUsername(userData.username);
  };

  React.useEffect(() => {
    validateAndFetch();
  }, [validateAndFetch]);

  return (
    <UserContext.Provider
      value={{ isLogged, username, loginAction, logoutAction }}
    >
      {children}
    </UserContext.Provider>
  );
};
