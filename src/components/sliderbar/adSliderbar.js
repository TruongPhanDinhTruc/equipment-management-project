import logo from "../../assets/img/logo.PNG";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/page/pageSlice";
import { Button, Card, Menu, Typography } from "antd";
import { DoubleLeftOutlined, HomeOutlined, LogoutOutlined, MenuOutlined, SlidersOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";

export function AdSidebar({ isMinimized, toggleSidebar, isHideLogo }) {
   const selected = useSelector((state) => state.page?.page?.titile);
   const theme = useSelector((state) => state.theme?.theme?.currentTheme);

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleLogout = () => {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("role");
      // dispatch(setPageTitle("User Management"))
      navigate("/auth");
   };

   const menuItems = [
      {
         key: "Dashboard",
         icon: <HomeOutlined />,
         label: "Dashboard",
         onClick: () => {
            dispatch(setPageTitle("Dashboard"));
            navigate("/main/dashboard");
         },
      },
      {
         key: "User Management",
         icon: <UserOutlined />,
         label: "User Management",
         onClick: () => {
            dispatch(setPageTitle("User Management"));
            navigate("/main/user-management");
         },
      },
      {
         key: "Equip Management",
         icon: <SlidersOutlined />,
         label: "Equip Management",
         onClick: () => {
            dispatch(setPageTitle("Equip Management"));
            navigate("/main/equip-management");
         },
      },
      {
         key: "Maintenance Management",
         icon: <ToolOutlined />,
         label: "Maintenance",
         onClick: () => {
            dispatch(setPageTitle("Maintenance Management"));
            navigate("/main/maintenance-management");
         },
      },
   ];

   return (
      <Card
         className={`${isMinimized ? "w-30" : "w-96"
            } h-screen max-w-[17rem] p-1 shadow-xl rounded-none transition-all duration-300 flex flex-col dark:bg-gray-800`}>
         <div className="mb-2 flex items-center">
            <img src={logo} alt="logo" className="h-20 w-20" />
            {!isMinimized && !isHideLogo && (
               <Typography.Title className="italic dark:text-white" level={2}>
                  EquipMS
               </Typography.Title>
            )}
         </div>

         <Menu
            theme={theme}
            className="transition-all duration-300 flex flex-col dark:bg-gray-800"
            mode="inline"
            selectedKeys={[selected]}
            items={menuItems.map((item) => ({
               ...item,
               className: "dark:text-white",
            }))}
            inlineCollapsed={isMinimized} />

         <div className="mt-auto">
            <Menu
               // theme="dark" 
               className="dark:bg-gray-800"
               mode="inline">
               <Menu.Item
                  key="logout"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className="mt-10 mb-10 rounded-lg dark:text-white duration-300">
                  {!isMinimized && <span className="text-lg mr-5">Log Out</span>}
               </Menu.Item>
            </Menu>
            <hr className="my-2 border-blue-gray-500" />
            <div className={`flex items-center ${isMinimized ? "justify-between" : "justify-end"}`}>
               {!isMinimized && <span className="text-lg dark:text-white mr-5">Collapse menu</span>}
               <Button
                  size="sm"
                  type="text"
                  className="w-fit text-center dark:text-white dark:bg-gray-800"
                  onClick={toggleSidebar}>
                  {isMinimized ? <MenuOutlined /> : <DoubleLeftOutlined />}
               </Button>
            </div>
         </div>
      </Card>
   );
}
