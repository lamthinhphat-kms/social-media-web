import React, { useContext } from "react";
import {
  UploadOutlined,
  UserOutlined,
  SearchOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import MainRoutes from "../routes/MainRoutes";
import { AuthContext } from "../context/AuthContext";

const { Content, Sider } = Layout;

const SideNav: React.FC = () => {
  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  return (
    <Layout hasSider>
      <Sider style={{ height: "100vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[window.location.pathname]}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
            items={[
              {
                key: "/",
                icon: <HomeOutlined />,
                label: "Home",
                onClick: () => {
                  console.log("123");
                  navigate("/");
                },
              },
              {
                key: "/search",
                icon: <SearchOutlined />,
                label: "Search",
                onClick: () => {
                  navigate("/search");
                },
              },
              {
                key: "/upload",
                icon: <UploadOutlined />,
                label: "Upload",
                onClick: () => {
                  navigate("/upload");
                },
              },
              {
                key: "/profile",
                icon: <UserOutlined />,
                label: "Profile",
                onClick: () => {
                  navigate("/profile");
                },
              },
            ]}
          />
          <Menu
            style={{ marginBottom: "auto" }}
            theme="dark"
            mode="inline"
            items={[
              {
                key: "/logout",
                icon: <LogoutOutlined />,
                label: "Log out",
                onClick: () => {
                  logout();
                },
              },
            ]}
            selectable={false}
          />
        </div>
      </Sider>
      <Layout
        style={{
          flex: 1,
          overflow: "scroll",
          overflowX: "hidden",
        }}
      >
        <Content>
          <MainRoutes />
        </Content>
      </Layout>
    </Layout>
  );
};
export default SideNav;
