import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/main/HomePage/HomePage";
import ProfilePage from "../pages/main/ProfilePage/ProfilePage";
import UploadPage from "../pages/main/UploadPage/UploadPage";
import { useMemo } from "react";
import ChatPage from "../pages/main/ChatPage/ChatPage";

function MainRoutes() {
  const { pathname } = useLocation();
  const key = useMemo(() => {
    return pathname.split("/").pop();
  }, [pathname]);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile/:id" element={<ProfilePage key={key} />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/chat/:roomId" element={<ChatPage key={key} />} />
      <Route path="/*" element={<h1>Error</h1>} />
    </Routes>
  );
}

export default MainRoutes;
