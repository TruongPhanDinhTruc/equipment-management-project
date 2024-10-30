import logo from "../../assets/img/logo.PNG";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/page/pageSlice";
import { Button, Card, List, Menu, Typography } from "antd";
import { DoubleLeftOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
// import { UserOutlined, HomeOutlined, SettingOutlined, LogoutOutlined, DoubleLeftOutlined } from '@ant-design/icons';

export function AdSidebar({ isMinimized, toggleSidebar, isHideLogo }) {
   const selected = useSelector((state) => state.page?.page?.titile);

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleLogout = () => {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("role");
      dispatch(setPageTitle("User Management"))
      navigate("/auth");
   };

   const menuItems = [
      {
         key: "user-management",
         icon: <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.689Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432Z" /></svg>,
         label: "User Management",
         onClick: () => {
            dispatch(setPageTitle("User Management"));
            navigate("/main/user-management");
         },
      },
      {
         key: "equip-management",
         icon: <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.689Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432Z" /></svg>,
         label: "Equip Management",
         onClick: () => {
            dispatch(setPageTitle("Equip Management"));
            navigate("/main/equip-management");
         },
      },
      {
         key: "maintenance-management",
         icon: <svg width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.689Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432Z" /></svg>,
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
               <Typography.Title className="italic dark:text-white" level={3}>
                  EquipCondo
               </Typography.Title>
            )}
         </div>

         <Menu
            // theme="dark"
            className="transition-all duration-300 flex flex-col dark:bg-gray-800"
            mode="inline"
            // items={menuItems}
            items={menuItems.map((item) => ({
               ...item,
               className: "dark:text-white dark:hover:text-blue-400",
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
                  className="mt-10 mb-10 rounded-lg dark:text-white">
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
