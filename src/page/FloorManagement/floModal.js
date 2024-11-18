import { Button, Form, Input, InputNumber, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import FloInputField from './floInputField';
import { toast } from 'react-toastify';
import { realtimeDB } from '../../firebase';
import { ref, set, update, get } from 'firebase/database';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

function FloModal({ isOpenModal, isAddModal, setIsOpenModal, form }) {
  const [isLoading, setIsLoading] = useState(false);
  const [roomList, setRoomList] = useState([]);

  const handleCancel = (e) => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    getAllRoomByFloorId();
  }, []);

  const getAllRoomByFloorId = () => {
    setRoomList(form?.getFieldValue("floorRoom"));
  };

  const handleAdd = async (e) => {
    setIsLoading(true);
    let postData = {
      ...form.getFieldsValue(true),
      floorRoom: roomList,
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
      floorRoom: roomList,
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
  
  const handleAddRoom = () => {
    const maxKey = roomList.length > 0 ? Math.max(...roomList.map((room) => room.key)) : 0;
    const newRoom = {
      key: maxKey + 1,
      roomNumber: null,
      roomType: "",
    };
    setRoomList([...roomList, newRoom]);
  };

  const handleDeleteRoom = (key) => {
    const newRoomList = roomList.filter((room) => room.key !== key);
    setRoomList(newRoomList);
  };

  const handleInputChange = (value, key, field) => {
    const newData = roomList.map((room) => {
      if (room.key === key) {
        return { ...room, [field]: value };
      }
      return room;
    });
    setRoomList(newData);
  };

  console.log("Room List: ", roomList);

  const columnRoom = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      editable: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
      render: (text, record) => (
        <InputNumber
          style={{ width: "100%" }}
          value={text}
          onChange={(e) => handleInputChange(e, record.key, "roomNumber")}
          placeholder="Room Number"
          min={1}
        />
      ),
    },
    {
      title: "Room Type",
      dataIndex: "roomType",
      key: "roomType",
      render: (text, record) => (
        <Input
          value={record.roomType}
          onChange={(e) => handleInputChange(e.target.value, record.key, "roomType")}
          placeholder="Enter room type"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRoom(record.key)}
          type="text"
        />
      ),
    },
  ];

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
        {/* <div className="flex gap-4">
          <FloInputField name={"total_rooms"} label={"Total Rooms"} type={"text"} />
        </div> */}
        <div className="">
          <h2 className="text-2xl font-medium mb-4 text-orange">Room Information</h2>
          <Table
            className="custom-table mt-2"
            columns={columnRoom}
            dataSource={roomList}
            pagination={false}
            rowKey="key"
            bordered
            size="small"
            scroll={{ x: "max-content" }}
            footer={() => (
              <Button type="dashed" icon={<PlusCircleOutlined />} onClick={handleAddRoom}>
                Add Room
              </Button>
            )} />
        </div>
      </Form>
    </Modal>
  );
}

export default FloModal;
