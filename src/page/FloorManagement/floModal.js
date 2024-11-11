import { Button, Form, Modal } from 'antd';
import React, { useState } from 'react';
import FloInputField from './floInputField';
import { toast } from 'react-toastify';
import { realtimeDB } from '../../firebase';
import { ref, set, update, get } from 'firebase/database';

function FloModal({ isOpenModal, isAddModal, setIsOpenModal, form }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = (e) => {
    setIsOpenModal(false);
  };

const handleAdd = async (e) => {
  setIsLoading(true);
  let postData = {
    ...form.getFieldsValue(true),
  };
  const floRef = ref(realtimeDB, '/flo/');

  try {
    const snapshot = await get(floRef);
    const currentData = snapshot.exists() ? snapshot.val() : {};
    const newId = Object.keys(currentData).length + 1;

    postData.id = newId;

    await set(ref(realtimeDB, `/flo/${newId}`), postData);

    toast.success("Add floor successfully");
    setIsOpenModal(false);
  } catch (err) {
    toast.error("Failed to add floor: " + err.message);
  } finally {
    setIsLoading(false);
  }
};

  const handleEdit = async (e) => {
    setIsLoading(true);
    let postData = {
      ...form.getFieldsValue(true),
    };

    const updates = {};
    updates["/flo/" + form.getFieldValue("id")] = postData;

    return await update(ref(realtimeDB), updates)
      .then(
        toast.success("Update floor successfully"),
        setIsOpenModal(false),
      )
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      width={800}
      centered
      open={isOpenModal}
      onCancel={handleCancel}
      footer={(_, { CancelBtn }) => (
        <>
          <CancelBtn />
          <Button loading={isLoading} htmlType="submit" form="flo_form" className="bg-orange text-white">{isAddModal ? "Add Floor" : "Save Floor"}</Button>
        </>
      )}
    >
      <h1 className="text-3xl font-bold mb-4 text-orange text-center">{isAddModal ? "ADD FLOOR" : "EDIT FLOOR"}</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={isAddModal ? handleAdd : handleEdit}
        name="flo_form"
        id="flo_form"
        clearOnDestroy
      >
        <h2 className="text-2xl font-medium mb-4 text-orange">Floor Information</h2>
        <div className="flex gap-4">
          <FloInputField name={"floNumber"} label={"Floor Number"} type={"text"} />
          <FloInputField name={"floDescription"} label={"Description"} type={"text"} />
        </div>
        <div className="flex gap-4">
          <FloInputField name={"total_rooms"} label={"Total Rooms"} type={"text"} />
        </div>
      </Form>
    </Modal>
  );
}

export default FloModal;
