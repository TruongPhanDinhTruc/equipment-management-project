import { Button, Form, Modal } from 'antd'
import React, { useState } from 'react'
import ProfileInputField from './profileInputField';
import { get, ref, update } from 'firebase/database';
import { realtimeDB } from '../../firebase';
import { toast } from 'react-toastify';

function ProfileModal({ isOpenEditModal, setIsOpenEditModal, currentUserLogin, form }) {
  const [isLoading, setIsLoading] = useState(false);

  // const handleEdit = async (e) => {
  //   setIsLoading(true);
  //   let postData = form.getFieldsValue(true);
  //   const userId = form.getFieldValue("id");

  //   // Lấy dữ liệu hiện tại của user từ Firebase trước khi cập nhật
  //   const currentDataSnapshot = await get(ref(realtimeDB, `/users/${userId}`));
  //   const currentData = currentDataSnapshot.val();

  //   // Nếu postData không có userPassword, giữ lại userPassword hiện tại
  //   if (!postData.userPassword && currentData?.userPassword) {
  //       postData.userPassword = currentData.userPassword;
  //   }
    
  //   const updates = {};
  //   updates[`/users/${userId}`] = postData;

  //   return await update(ref(realtimeDB), updates)
  //     .then(() => {
  //       sessionStorage.setItem("user", JSON.stringify(postData));
  //       form.setFieldsValue(postData);
  //       toast.success("Update user successfully");
  //       setIsOpenEditModal(false);
  //     })
  //     .catch((err) => {
  //       toast.error(err);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };
  const handleEdit = async (e) => {
    setIsLoading(true);

    let postData = form.getFieldsValue(true);
    const userId = form.getFieldValue("id");
    const newEmail = postData.userEmail;
    const newPhone = postData.userPhone;

    try {
        const usersSnapshot = await get(ref(realtimeDB, "/users"));
        const usersData = usersSnapshot.val();

        const isEmailDuplicated = Object.values(usersData).some(
            (user) => user.userEmail === newEmail && user.id !== userId
        );
        const isPhoneDuplicated = Object.values(usersData).some(
            (user) => user.userPhone === newPhone && user.id !== userId
        );

        if (isEmailDuplicated) {
            toast.error("Email already exists.");
            return;
        }

        if (isPhoneDuplicated) {
            toast.error("Phone number already exists.");
            return;
        }

        const currentDataSnapshot = await get(ref(realtimeDB, `/users/${userId}`));
        const currentData = currentDataSnapshot.val();

        if (!postData.userPassword && currentData?.userPassword) {
            postData.userPassword = currentData.userPassword;
        }

        const updates = {};
        updates[`/users/${userId}`] = postData;

        await update(ref(realtimeDB), updates);
        sessionStorage.setItem("user", JSON.stringify(postData));
        form.setFieldsValue(postData);
        toast.success("Update user successfully");
        setIsOpenEditModal(false);
    } catch (error) {
        toast.error("Error updating user: " + error.message);
    } finally {
        setIsLoading(false);
    }
};

  const handleCancel = (e) => {
    setIsOpenEditModal(false);
  };
  return (
    <>
      <Modal
        centered
        width={400}
        open={isOpenEditModal}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              loading={isLoading}
              htmlType="submit"
              form="profile_form"
              className="bg-orange text-white"
            >
              Save
            </Button>
          </>
        )}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
          name="profile_form"
          id="profile_form"
          clearOnDestroy>
          <h1 className="text-3xl justify-center flex font-bold mb-4 text-orange">Profile Information</h1>
          <ProfileInputField name={"userName"} label={"Name"} />
          <ProfileInputField name={"userEmail"} label={"Email"} />
          <ProfileInputField name={"userPhone"} label={"Phone Number"} />
        </Form>
      </Modal>
    </>
  )
}

export default ProfileModal