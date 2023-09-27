import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/main/HomePage/HomePage";
import ProfilePage from "../pages/main/ProfilePage/ProfilePage";
import UploadPage from "../pages/main/UploadPage/UploadPage";
import { useMemo } from "react";

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
      <Route path="/*" element={<h1>Error</h1>} />
    </Routes>
  );
}

export default MainRoutes;
