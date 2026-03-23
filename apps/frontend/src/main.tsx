import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="335291236627-58fqcujt7ivc2ssbvboduv539mv1lrss.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
);
