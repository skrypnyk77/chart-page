import React from "react";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

import { useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("Home", "home", <HomeOutlined />),
  getItem("Profile", "profile", <UserOutlined />),
  getItem("Settings", "settings", <SettingOutlined />),
  getItem("Users", "users", <UsergroupDeleteOutlined />),
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(`/charts/${e.key}`);
  };

  return (
    <Menu
      onClick={onClick}
      style={{
        width: 122,
        background: "#ffffff",
        position: "fixed",
        left: 0,
        height: "100%",
        zIndex: 1,
      }}
      defaultSelectedKeys={["settings"]}
      mode="inline"
      items={items}
    />
  );
};

export default Sidebar;
