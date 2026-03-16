import React from "react";
import { tokenValidate } from "../services/authService";
import { userService } from "../services/userService";

interface UserContextData {
  isLogged: boolean;
  username: string;
  loginAction: (token: string) => void;
  logoutAction: () => void;
}

export const UserContext = React.createContext<UserContextData>(
  {} as UserContextData,
);

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

  const loginAction = (token: string) => {
    window.localStorage.setItem("token", token);
    validateAndFetch();
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
