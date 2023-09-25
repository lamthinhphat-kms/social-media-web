import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ClipLoader } from "react-spinners";
import { Navigate, Route, Routes } from "react-router-dom";
import SideNav from "../navigation/SideNav";
import LoginPage from "../pages/auth/LoginPage/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage/SignUpPage";

function RootRoutes() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    isLoggedIn().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ClipLoader loading={isLoading} />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {user ? (
          <>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/sign-up" element={<Navigate to="/" />} />
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
