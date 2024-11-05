import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../redux/page/pageSlice';
import { EditOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import background from "../../../src/assets/img/bg-user.png";
import { Form } from "antd";
import ProfileModal from './profileModal';

function ProfileUserPage() {
  const currentUserLogin = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : {};
  const [form] = Form.useForm();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      navigate("/auth/");
      return;
    }
    dispatch(setPageTitle("My Profile"));
  }, []);

  console.log("Current user: ", currentUserLogin);

  return (
    <>
      <div className="w-full bg-white flex flex-wrap justify-center">
        <div className="w-full shadow-lg transform duration-200 easy-in-out">
          <div className="max-h-72 overflow-hidden">
            <img className="w-full" src={background} alt="" />
          </div>
          <div className="flex justify-center px-5 -mt-12 select-none">
            <div className="h-32 w-32 p-2 rounded-full bg-purple flex justify-center items-center">
              <span className="flex justify-center text-5xl">
                {currentUserLogin?.userName?.substring(0, 1)}
              </span>
            </div>
          </div>
          <div>
            <div className="text-center px-14">
              <h2 className="text-purple text-3xl font-bold">
                <span className="mr-3">{currentUserLogin.userName}</span>
                <EditOutlined
                  onClick={() => {
                    form.setFieldsValue(currentUserLogin);
                    setIsOpenEditModal(true);
                  }}
                  style={{
                    color: "green",
                    fontSize: "26px",
                    cursor: "pointer",
                  }}
                />
              </h2>
              <p>
                <MailOutlined /> {currentUserLogin.userEmail}
              </p>
              <p>
                <PhoneOutlined /> {currentUserLogin.userPhone}
              </p>
            </div>
          </div>
        </div>
      </div>
      {isOpenEditModal && (
        <ProfileModal
          isOpenEditModal={isOpenEditModal}
          setIsOpenEditModal={setIsOpenEditModal}
          form={form}
          currentUserLogin={currentUserLogin} />
      )}
    </>
  )
}

export default ProfileUserPage