import React, { useContext } from "react";
import SideNav from "./navigation/SideNav";
import { AuthContext } from "./context/AuthContext";
import RootRoutes from "./routes/RootRoutes";

const App: React.FC = () => {
  const { isLoading } = useContext(AuthContext);

  return (
    <>
      {/* <SideNav /> */}
      <RootRoutes />
    </>
  );
};

export default App;
