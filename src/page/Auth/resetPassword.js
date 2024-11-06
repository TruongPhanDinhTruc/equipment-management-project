import { Button, Form, Input } from 'antd';
import { child, get, ref, update } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { realtimeDB } from '../../firebase';

function ResetPassword() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const email = atob(new URLSearchParams(location.search).get("email"));
  const inputEmailRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputEmailRef.current?.focus();
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

  const handleResetPass = async (values) => {
    setLoading(true);
    const { password, confirmPass } = values;

    if (password !== confirmPass) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userList = await getUserList();

      // Tìm kiếm người dùng với email đã cung cấp
      const userFound = Object.values(userList).find(
        (user) => user.userEmail === email
      );

      if (!userFound) {
        toast.error(<CustomToastWithLink />);
        navigate("/auth/login");
        return;
      }

      // Tiến hành reset mật khẩu
      const updates = {};
      updates[`/users/${userFound.id}/userPassword`] = password;

      await update(ref(realtimeDB), updates);
      toast.success("Password reset successfully");

    } catch (error) {
      toast.error("Error resetting password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const CustomToastWithLink = () => (
    <div>
      Account does not exist!
      <br />
      {/* <Link to="/auth/register">Click here to create a new account!</Link> */}
      <span>Contact Admin to create new account!</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 h-full w-full overflow-hidden">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6"></div>
            <div className="text-center mb-3">
              <h1 className="text-blueGray-500 text-2xl font-bold">
                RESET PASSWORD
              </h1>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10">
              <Form form={form} layout="vertical" onFinish={handleResetPass}>
                <Form.Item label="Change new password for user" name="email">
                  <Input
                    value={email}
                    ref={inputEmailRef}
                    type="email"
                    readOnly
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter your new password..."
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPass"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm your password..."
                    size="large"
                  />
                </Form.Item>

                <Form.Item className="text-center mt-6">
                  <Button
                    loading={loading}
                    disabled={loading}
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="justify-center items-center bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase w-full ease-linear transition-all duration-150"
                  >
                    {loading ? " " : "Reset Password"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword