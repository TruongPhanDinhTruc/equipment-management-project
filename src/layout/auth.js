import React from "react";
import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import background from "../assets/img/register_bg_2.png";

export default function Auth() {
  return (
    <>
      <main>
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
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage: `url(${background})`,
            }}
          ></div>
          <Outlet></Outlet>
        </section>
      </main>
    </>
  );
}
