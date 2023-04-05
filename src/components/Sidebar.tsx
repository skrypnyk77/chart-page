import React from "react";
import {
  HomeOutlined,
  UserOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Image } from "antd";

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
  getItem("Dashboard", "dashboard", <HomeOutlined />),
  getItem("Profile", "profile", <UserOutlined />),
  getItem("Users", "users", <UsergroupDeleteOutlined />),
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(`/charts/${e.key}`);
  };

  return (
    <div
      style={{
        width: 180,
        background: "#ffffff",
        position: "fixed",
        left: 0,
        height: "100%",
        zIndex: 1,
        boxShadow: "0 0 10px 5px #bbb",
      }}
    >
      <div style={{ margin: '20px 16px 20px 24px' }}>
        <Image
          width={140}
          height={38}
          preview={false}
          src="https://solutions4ga.com/wp-content/themes/wi/images/logo.png"
        />
      </div>
      <Menu
        onClick={onClick}
        defaultSelectedKeys={["dashboard"]}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default Sidebar;
