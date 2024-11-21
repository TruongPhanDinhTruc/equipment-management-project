import { Button, Form, Modal } from 'antd';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import LocInputField from './locInputField';
import { toast } from 'react-toastify';
import { realtimeDB } from '../../firebase';
import { child, ref, set, update } from 'firebase/database';
import LocSelectField from './locSelectField';

function LocModal({ isOpenModal, isAddModal, setIsOpenModal, form, floList }) {
  const locList = useSelector((state) => state.loc?.loc?.allLoc);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = (e) => {
    setIsOpenModal(false);
  };

  const handleAdd = async (e) => {
    setIsLoading(true);
    const id = [...locList].pop().id + 1;
    const locRef = child(ref(realtimeDB), "loc/" + id);

    await set(locRef, {
      id: id,
      ...form.getFieldsValue(true),
    })
      .then(toast.success("Add new location successfully"), setIsOpenModal(false))
      .catch((err) => {
        toast.error("Error adding data: " + err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleEdit = async (e) => {
    setIsLoading(true);
    let postData = {
      ...form.getFieldsValue(true),
    };

    const updates = {};
    updates["/loc/" + form.getFieldValue("id")] = postData;

    return await update(ref(realtimeDB), updates)
      .then(
        toast.success("Update location successfully"),
        setIsOpenModal(false),
      )
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  console.log("Floor Option: ", floList);
  return (
    <>
      <Modal
        width={800}
        centered
        open={isOpenModal}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button loading={isLoading} htmlType="submit" form="loc_form" className="bg-orange text-white">{isAddModal ? "Add Location" : "Save Location"}</Button>
          </>
        )}>
        <h1 className="text-3xl font-bold mb-4 text-orange text-center">{isAddModal ? "ADD LOCATION" : "EDIT LOCATION"}</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={isAddModal ? handleAdd : handleEdit}
          name="loc_form"
          id="loc_form"
          clearOnDestroy>
          <h2 className="text-2xl font-medium mb-4 text-orange">Location Infomation</h2>
          <div className="flex gap-4">
            <LocInputField name={"locName"} label={"Location Name"} type={"text"}/>
            {/* <LocInputField name={"locFloorId"} label={"Floor Number"} type={"number"}/> */}
            <LocSelectField name={"locFloorId"} label={"Floor Number"} listSelect={floList} />
          </div>
          <div className="flex gap-4">
            <LocInputField name={"locArea"} label={"Area"} type={"text"}/>
            <LocInputField name={"locDescription"} label={"Description"} type={"text"}/>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default LocModal