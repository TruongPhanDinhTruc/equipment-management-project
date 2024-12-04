import { Button, Cascader, DatePicker, Form, Input, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { ref, update } from 'firebase/database';
import { toast } from 'react-toastify';
import { realtimeDB } from '../../firebase';

function MaintModal({ isOpenModal, setIsOpenModal, form, flo, loc }) {
  const equListFromRedux = useSelector((state) => state.equip?.equ?.allEqu);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = (e) => {
    setIsOpenModal(false);
  };

  const options = flo?.map((floor) => {
    return {
      value: floor.id,
      label: `Floor ${floor.floNumber}`,
      children: loc
        .filter((location) => location.locFloorId === floor.id)
        .map((location) => ({
          value: location.id,
          label: location.locName,
        })),
    };
  });

  const handleEdit = (e) => {
    setIsLoading(true);
    const maintDate = e.maintenanceDate ? e.maintenanceDate.valueOf() : null;

    const allValues = form.getFieldsValue(true);

    const { maintenanceDate, status, ...otherValues } = allValues;
    const postData = {
      ...otherValues,
    };
    if (maintDate !== null)
      postData.maintDate = maintDate;

    const equId = form.getFieldValue("id");
    const updates = {};
    updates["/maint/" + equId] = postData;
    if (status != null)
      updates["/equ/" + equId + "/equStatus"] = status;

    return update(ref(realtimeDB), updates)
      .then(toast.success("Update Maintenance Successfully"), setIsOpenModal(false))
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const calculateDaysLeft = (maintenanceDate) => {
    if (!maintenanceDate) return null; // Nếu không có ngày, trả về null

    const today = new Date();
    const maintDate = new Date(maintenanceDate);
    // Tính khoảng cách thời gian giữa hai ngày (ms)
    const timeDiff = maintDate - today;
    // Chuyển từ ms sang ngày
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysLeft > 0 ? daysLeft : 0;
  };

  const checkWarrantyDate = (value) => {
    if (value > 0)
      return value + " days left until warranty expires";
    return "Warranty expired"
  }

  const checkMaintDate = (value) => {
    if (value > 0)
      return value + " days";
    return "Maintenance date has come"
  }

  const getEquById = (id) => {
    const equ = equListFromRedux?.find(
      (equ) => String(equ?.id) === String(id)
    );
    return equ;
  }

  const handleChangeColor = (value) => {
    switch (value) {
      case 1:
        setBgColor("#22C55E");
        break;
      case 2:
        setBgColor("#FFB038");
        break;
      case 3:
        setBgColor("#e50d0d");
        break;
      default:
        setBgColor("#4588C5");
    }
  };

  const handleDefaultColor = (value) => {
    switch (value) {
      case 1:
        return "#22C55E";
      case 2:
        return "#f9fad4";
      case 3:
        return "#e50d0d";
      default:
        return "#4588C5";
    }
  }
  const [bgColor, setBgColor] = useState(handleDefaultColor(getEquById(form?.getFieldValue("id")).equStatus));

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
            <Button loading={isLoading} htmlType="submit" form="maint_form" className="bg-orange text-white">Save</Button>
          </>
        )}>
        <h1 className="text-3xl font-bold mb-4 text-orange text-center">EDIT EQUIP MAINTENANCE</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
          name="maint_form"
          id="maint_form"
          clearOnDestroy>
          <h2 className="text-2xl font-medium mb-4 text-orange">Maintenance Infomation</h2>
          <div className="flex gap-4">
            <span className="text-2xl font-medium mb-4 text-orange justify-start">Equip Status</span>
            <div className="w-1/2 rounded-2xl text-white">
              <Form.Item
                name="status"
                className="w-2/5 rounded-3xl text-white text-center"
              >
                <Select
                  size="large"
                  defaultValue={getEquById(form?.getFieldValue("id")).equStatus}
                  onChange={handleChangeColor}
                  options={[
                    { label: "Activating", value: 1 },
                    { label: "Under repair", value: 2 },
                    { label: "Defective", value: 3 },
                  ]}
                  style={{
                    backgroundColor: bgColor,
                    borderRadius: "1rem",
                    color: "#FFFFFF",
                  }}
                  variant='borderless'
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <Form.Item
                // name="id"
                label="Equip Name"
              >
                <Input value={getEquById(form?.getFieldValue("id")).equName} readOnly size="large" />
              </Form.Item>
            </div>
            <div className="w-1/6">
              <Form.Item
                // name="id"
                label="# ID"
              >
                <Input value={form?.getFieldValue("id")} readOnly size="large" />
              </Form.Item>
            </div>
            <div className="w-1/2">
              <Form.Item
                name="maintLoc"
                label="Location"
              >
                {/* <Input size="large" /> */}
                <Cascader
                size='large'
                  options={options}
                  changeOnSelect
                  // onChange={(value) => {
                  //   const [maintFloorId, maintLocId, maintRoomId] = value || [];
                  //   const locationObject = {
                  //     maintFloorId,
                  //     maintLocId,
                  //     maintRoomId,
                  //   };
                  // }}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Form.Item
                // name="id"
                label="Maintenance Remaining"
              >
                <Input value={checkMaintDate(calculateDaysLeft(form?.getFieldValue("maintDate")))} readOnly size="large" />
              </Form.Item>
            </div>
            <div className="w-1/2">
              <Form.Item
                name="maintenanceDate"
                label="Maintenance Date"
              >
                <DatePicker defaultValue={dayjs(form?.getFieldValue("maintDate"))} size="large" />
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Form.Item
                // name="id"
                label="Warranty Remaining"
              >
                <Input value={checkWarrantyDate(calculateDaysLeft(getEquById(form?.getFieldValue("id")).equExpiryDate))} readOnly size="large" />
              </Form.Item>
            </div>
            <div className="w-1/2">
              <Form.Item
                // name="maintenanceDate"
                label="Warranty Date"
              >
                <DatePicker disabled defaultValue={dayjs(getEquById(form?.getFieldValue("id")).equExpiryDate)} size="large" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default MaintModal