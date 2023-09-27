import React, { useCallback, useContext, useState } from "react";
import {
  UploadOutlined,
  UserOutlined,
  SearchOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Drawer, Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import MainRoutes from "../routes/MainRoutes";
import { AuthContext } from "../context/AuthContext";
import SearchPage from "../pages/main/SearchPage/SearchPage";

const { Content, Sider } = Layout;

const SideNav: React.FC = () => {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleOnClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Layout hasSider>
        <Sider style={{ height: "100vh" }} breakpoint="lg" collapsedWidth="0">
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
              selectedKeys={[window.location.pathname]}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              items={[
                {
                  key: "/",
                  icon: <HomeOutlined />,
                  label: "Home",
                  onClick: () => {
                    navigate("/");
                  },
                },
                {
                  key: "/search",
                  icon: <SearchOutlined />,
                  label: "Search",
                  onClick: () => {
                    setOpen(true);
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
                  key: `/profile/${user?.id}`,
                  icon: <UserOutlined />,
                  label: "Profile",
                  onClick: () => {
                    navigate(`/profile/${user?.id}`);
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
      <Drawer
        open={open}
        placement="left"
        closeIcon={null}
        onClose={handleOnClose}
        bodyStyle={{
          padding: "0px",
        }}
      >
        <SearchPage handleCloseDrawer={handleOnClose} />
      </Drawer>
    </>
  );
};
export default SideNav;
