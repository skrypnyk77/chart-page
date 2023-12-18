import React, { useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Image } from "antd";

import { useStores } from "../use-stores";

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

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const {
    userStore: { isAdmin },
  } = useStores();

  const splittedPathname = window.location.pathname?.split("/");

  const [current, setCurrent] = useState(
    splittedPathname[splittedPathname.length - 1]
  );

  const items: MenuProps["items"] = [
    getItem("Dashboard", "dashboard", <HomeOutlined />),
    getItem("Profile", "profile", <UserOutlined />),
    isAdmin && getItem("Users", "users", <UsergroupDeleteOutlined />),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(`/charts/${e.key}`);

    setCurrent(e.key);
  };

  return (
    <div
      style={{
        width: 200,
        background: "#ffffff",
        position: "fixed",
        left: 0,
        height: "100%",
        zIndex: 1,
        boxShadow: "0 0 10px 5px #bbb",
      }}
    >
      <div style={{ margin: "20px 13px" }}>
        <Image
          preview={false}
          src="https://solutions4ga.com/wp-content/themes/wi/images/logo.png"
        />
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default Sidebar;
