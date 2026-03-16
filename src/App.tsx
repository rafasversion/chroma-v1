import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./assets/App.css";
import AppRoutes from "./AppRoutes";
import { UserStorage } from "./contexts/UserContext";
export default function App() {
  return (
    <UserStorage>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserStorage>
  );
}
