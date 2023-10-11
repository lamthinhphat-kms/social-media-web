import { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ChatPage from "../pages/main/ChatPage/ChatPage";
import HomePage from "../pages/main/HomePage/HomePage";
import ProfilePage from "../pages/main/ProfilePage/ProfilePage";

function MainRoutes() {
  const { pathname } = useLocation();
  const key = useMemo(() => {
    return pathname.split("/").pop();
  }, [pathname]);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile/:id" element={<ProfilePage key={key} />} />
      <Route path="/chat/:roomId" element={<ChatPage key={key} />} />
      <Route path="/*" element={<h1>Error</h1>} />
    </Routes>
  );
}

export default MainRoutes;
