import { Route, Routes } from "react-router-dom";
import SearchPage from "../pages/main/SearchPage/SearchPage";
import HomePage from "../pages/main/HomePage/HomePage";
import ProfilePage from "../pages/main/ProfilePage/ProfilePage";
import UploadPage from "../pages/main/UploadPage/UploadPage";

function MainRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/*" element={<h1>Error</h1>} />
      </Routes>
    </div>
  );
}

export default MainRoutes;
