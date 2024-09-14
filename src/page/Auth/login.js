import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { realtimeDB } from "../../firebase";
import { child, get, ref } from 'firebase/database';
import { toast } from "react-toastify";
import { getCurrentLoginUser } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const inputEmailRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    inputEmailRef?.current?.focus();
  }, []);

  const getUserList = async () => {
    try {
      const dbRef = ref(realtimeDB);

      const admin = await get(child(dbRef, "admin"));
      const user = await get(child(dbRef, "user"));

      const data1 = admin.exists() ? admin.val() : null;
      const data2 = user.exists() ? user.val() : null;

      // Combine data into an array
      const userList = data1.concat(data2);
      return userList;
    } catch (error) {
      toast.error("Error fetching data: ", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await getUserList();
    const userList = await getUserList();
    if (
      !userList.some(
        (user) =>
          user?.adEmail === form.email ||
          user?.userEmail === form.email
      )
    )
      return toast.error();
    userList.forEach((user) => {
      if (
        user?.adEmail === form.email ||
        user?.userEmail === form.email
      ) {
        if (user.userPassword === form.password) {
          delete user.userPassword;
          dispatch(getCurrentLoginUser(user));
          sessionStorage.setItem("user", JSON.stringify(user));
          sessionStorage.setItem("role", "user");
          toast.success("Welcome " + user.userName);
          navigate("/main/");
        } else if (user.adPassword === form.password) {
          delete user.adPassword;
          dispatch(getCurrentLoginUser(user));
          sessionStorage.setItem("admin", JSON.stringify(user));
          sessionStorage.setItem("role", "admin");
          toast.success("Welcome Super Admin");
          navigate("/main/user-management");
        } else toast.error("Password is incorrect");
      }
    });
  }
  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6"></div>
            <div className="text-center mb-3">
              <h1 className="text-blueGray-500 text-2xl font-bold">SIGN IN</h1>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleLogin}>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Email
                  </label>
                  <input
                    ref={inputEmailRef}
                    type="email"
                    autoComplete="email"
                    name="email"
                    required
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Enter your email..."
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    name="password"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Enter your password..."
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                {/* <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        Remember me
                      </span>
                    </label>
                  </div> */}
                {/* <div className="flex flex-wrap justify-end items-end relative">
                  <p className="text-end text-sm text-gray-500">
                    <Link
                      to="/auth/forgetpass"
                      className="font-semibold leading-6 hover:text-indigo-500"
                    >
                      Forget password?
                    </Link>
                  </p>
                </div> */}
                <div className="text-center mt-6">
                  <button
                    className="justify-center items-center bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login