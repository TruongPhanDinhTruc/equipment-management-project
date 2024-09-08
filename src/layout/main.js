import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import { SupSidebar } from "../components/siderbar/supSidebar";
import Header from "../components/header/header";

export default function Admin() {
  const userRole = sessionStorage.getItem("role");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isHideLogo, setIsHideLogo] = useState(false);

  useEffect(() => {
    // Function to check window width and minimize sidebar if needed
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarMinimized(true);
        setIsHideLogo(true);
      } else {
        setIsSidebarMinimized(false);
        setIsHideLogo(false);
      }
    };

    // Attach event listener
    window.addEventListener("resize", handleResize);

    // Run on component mount to check initial window size
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };
  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* {userRole === "admin" && (
        <SupSidebar
          isMinimized={isSidebarMinimized}
          isHideLogo={isHideLogo}
          toggleSidebar={toggleSidebar}
        ></SupSidebar>
      )}
      {userRole === "user" && (
        <UniSidebar
          isMinimized={isSidebarMinimized}
          isHideLogo={isHideLogo}
          toggleSidebar={toggleSidebar}
        ></UniSidebar>
      )} */}
      <div className="w-full bg-blueGray-100 dark:bg-gray-200">
        {/* <AdminNavbar /> */}
        <div className="flex flex-col flex-1 h-screen w-full ">
          <Header isMinimized={isHideLogo} />
          <main className="w-full overflow-y-auto overflow-x-auto grid px-6 mx-auto">
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </div>
  );
}
