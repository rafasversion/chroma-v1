import { Routes, Route, useLocation } from "react-router-dom";
import Feed from "./pages/Feed/Feed";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Stats from "./pages/Stats";
import Header from "./components/Header/Header";
import Post from "./components/Post/Post";
import Board from "./pages/Board/Board";
import FolderDetail from "./components/Folder/FolderDetail";
import SearchPage from "./pages/Search/SearchPage";
import PasswordLost from "./components/User/PasswordLost";
import PasswordReset from "./components/User/PasswordReset";

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <main>
      <Header />
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board/:username?/:tab?" element={<Board />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/folder/:id" element={<FolderDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/password-lost" element={<PasswordLost />} />
        <Route path="/password-reset" element={<PasswordReset />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/post/:id" element={<Post />} />
        </Routes>
      )}
    </main>
  );
}

export default AppRoutes;
