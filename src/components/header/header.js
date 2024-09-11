import React, { useEffect, useState } from 'react'
// import { Menu, MenuHandler } from "@material-tailwind/react";
import { MoonFilled, SunFilled } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Switch } from "antd";

function Header({ isMinimized }) {
  const [darkMode, setDarkMode] = useState(true);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = sessionStorage.getItem("role");
  // const pageTile = useSelector((state) => state.page?.page?.titile);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  function getFirstLetter(name) {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    const lastNamePart = nameParts[nameParts.length - 1];
    return lastNamePart.charAt(0).toUpperCase();
  }

  const menuItems = (
    <Menu>
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Item key="3">Option 3</Menu.Item>
    </Menu>
  );

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="w-full flex items-center justify-between h-full px-6 mx-auto text-black dark:text-white">
        {!isMinimized && (
          <h1 className="relative flex text-5xl flex-wrap items-stretch">
            {/* {pageTile} */}Title Page
          </h1>
        )}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          <li className="relative">
            <div className="flex items-center">
              <Switch
                className="dark:bg-black bg-gray-200 "
                checked={darkMode}
                onChange={handleToggle}
                checkedChildren={
                  <MoonFilled style={{ color: "#f7f5f5", fontSize: "14px" }} />
                }
                unCheckedChildren={
                  <SunFilled style={{ color: "#e6f202", fontSize: "14px" }} />
                } />
            </div>
          </li>

          <li className="relative">
            <Dropdown overlay={menuItems} trigger={['click']}>
              {role === "admin" ? (
                <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>AD</Avatar>
              ) : user?.userName ? (
                <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
                  {getFirstLetter(user.userName)}
                </Avatar>
              ) : (
                <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>U</Avatar>
              )}
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header