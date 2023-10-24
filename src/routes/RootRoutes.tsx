import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SideNav from "../navigation/SideNav";
import LoginPage from "../pages/auth/LoginPage/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage/SignUpPage";
import Loading from "../components/Loading/Loading";
import MeetPage from "../pages/main/MeetPage/MeetPage";

function RootRoutes() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    isLoggedIn().then(() => {
      setIsLoading(false);
    });
  }, []);

  const { pathname } = useLocation();
  const key = useMemo(() => {
    return pathname.split("/").pop();
  }, [pathname]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Routes>
        {user ? (
          <>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/sign-up" element={<Navigate to="/" />} />
            <Route path="/meeting/:roomId" element={<MeetPage key={key} />} />
            <Route path="/*" element={<SideNav />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/*" element={<Navigate to={"/login"} />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default RootRoutes;
