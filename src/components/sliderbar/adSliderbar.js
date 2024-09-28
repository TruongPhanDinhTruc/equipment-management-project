import logo from "../../assets/img/logo.PNG";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../redux/page/pageSlice";
import { Button, Card, List, Typography } from "antd";
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
    return (
        <Card
            className={
                (isMinimized ? "w-20" : "w-96") +
                " h-screen max-w-[17rem] p-1 shadow-xl rounded-none transition-all duration-300 flex flex-col shadow-blue-gray-900/5 dark:bg-gray-800"
            }>
            <div className="mb-2 flex items-center">
                <img src={logo} alt="logo" className="h-20 w-20" />
                {!isMinimized && !isHideLogo && (
                    <Typography.Title
                        className="italic dark:text-white"
                        level={3}>
                        EquipCondo
                    </Typography.Title>
                )}
            </div>
            <Card className="p-0 h-5/6 dark:bg-gray-800">
                <List className="min-w-0 dark:text-white">
                    <List.Item
                        className=" dark:text-white dark:hover:text-blue-400 dark:hover:bg-white rounded-lg"
                        onClick={() => {
                            dispatch(setPageTitle("User Management"));
                            navigate("/main/user-management");
                        }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6">
                            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>
                        {!isMinimized && <span>User Management</span>}
                    </List.Item>
                    <List.Item
                        className=" dark:text-white dark:hover:text-blue-400 dark:hover:bg-white rounded-lg"
                        onClick={() => {
                            dispatch(setPageTitle("Equip Management"));
                            navigate("/main/equip-management");
                        }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6">
                            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>
                        {!isMinimized && <span>Equip Management</span>}
                    </List.Item>
                </List>
            </Card>

            <Card.Meta
                description={
                    <div>
                        <List>
                            <List.Item
                                onClick={handleLogout}
                                className="dark:text-white dark:hover:text-blue-400 dark:hover:bg-white mt-10 mb-10 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6">
                                    <path
                                        fillRule="evenodd"
                                        d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                                        clipRule="evenodd" />
                                </svg>
                                {!isMinimized && <span className="text-lg mr-5">Log Out</span>}
                            </List.Item>
                        </List>
                        <hr className="my-2 border-blue-gray-500" />
                        <div
                            className={
                                (!isMinimized ? "justify-end" : "justify-between") + " flex items-center"
                            }>
                            {!isMinimized && (
                                <span className="text-lg dark:text-white mr-5">Collapse menu</span>
                            )}
                            <Button
                                size="sm"
                                variant="text"
                                className="w-fit items-center text-center dark:text-white dark:bg-gray-800"
                                onClick={toggleSidebar}>
                                {isMinimized ? (
                                    <svg
                                        className="w-6 h-6"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeWidth="2"
                                            d="M5 7h14M5 12h14M5 17h14" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-8 h-7"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m17 16-4-4 4-4m-6 8-4-4 4-4" />
                                    </svg>
                                )}
                            </Button>
                        </div>
                    </div>
                } />
        </Card>
    );
}
