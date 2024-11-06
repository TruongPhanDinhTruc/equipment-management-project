import { Button, Form, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { realtimeDB } from "../../firebase";
import { child, get, ref } from 'firebase/database';
import { toast } from "react-toastify";

function ForgetPassword() {
  const [form] = Form.useForm();
  const inputEmailRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputEmailRef?.current?.focus();
  }, []);

  const getUserList = async () => {
    try {
      const dbRef = ref(realtimeDB);

      const user = await get(child(dbRef, "users"));

      const data1 = user.exists() ? user.val() : null;

      // Kết hợp dữ liệu thành một mảng
      const userList = Object.values(data1);
      return userList;
    } catch (error) {
      toast.error("Error fetching data: ", error);
    }
  };

  const handleFindEmail = async (values) => {
    setLoading(true);
    const userList = await getUserList();
    if (
      !userList.some(
        (user) =>
          user?.userEmail === values.email
      )
    )
      return toast.error(CustomToastWithLink);
    userList.forEach((user) => {
      if (user?.userEmail === values.email) {
        // sendEmail({
        //   toName: user.stdName,
        //   toEmail: user.stdEmail,
        //   templateKey: "studentForgetPass",
        // });
        toast.info(
          <div>
            <p>
              CHECK YOUR EMAIL! <br />
              Please check the email address <br />
              <span className="underline italic text-blue-500">
                {user.userEmail}
              </span>
              <br />
              for instructions to reset your password.
              <br />
            </p>
          </div>
        );
      }
    });
    setLoading(false);
  };

  const CustomToastWithLink = () => (
    <div>
      <>Account does not exist!</>
      <br></br>
      {/* <Link to="/auth/register">Click here to create new account!</Link> */}
      <span>Contact Admin to create new account!</span>
    </div>
  )

  return (
    <div className="container mx-auto px-4 h-full w-full overflow-hidden">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6"></div>
            <div className="text-center mb-3">
              <h1 className="text-blueGray-500 text-2xl font-bold">
                FORGET PASSWORD
              </h1>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              {/* Sử dụng Form từ antd */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFindEmail}
                autoComplete="off"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input
                    ref={inputEmailRef}
                    placeholder="Enter your email..."
                    autoComplete="email"
                  />
                </Form.Item>

                <div className="text-center mt-6">
                  <Button
                    loading={loading}
                    disabled={loading}
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="w-full justify-center items-center bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase rounded shadow hover:shadow-lg outline-none focus:outline-none"
                  >
                    {loading ? " " : "Reset Password"}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <Link to="/auth/">
                    <Button
                      size="large"
                      className="w-full justify-center items-center bg-white text-blueGray-800 active:bg-blueGray-600 text-sm font-bold uppercase rounded shadow hover:shadow-lg outline-none focus:outline-none"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword