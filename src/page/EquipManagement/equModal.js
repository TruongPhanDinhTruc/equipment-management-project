import { Button, DatePicker, Form, Modal } from 'antd'
import { child, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { realtimeDB } from '../../firebase';
import EquInputField from './equInputField';
import { toast } from "react-toastify";
import dayjs from 'dayjs';

function EquModal({ isOpenModal, isAddModal, setIsOpenModal, form }) {
  const equList = useSelector((state) => state.equip?.equ?.allEqu);
  const [isLoading, setIsLoading] = useState(false);
  const equManufactureDate = form?.getFieldValue("equManufactureDate");
  const equExpiryDate = form?.getFieldValue("equExpiryDate");
  useEffect(() => {

  }, []);

  const handleAdd = (e) => {
    setIsLoading(true);
    const id = [...equList].pop().id + 1;
    const equRef = child(ref(realtimeDB), "equ/" + id);
    const maintRef = child(ref(realtimeDB), "maint/" + id);
    const manufactureDate = e.equManufactureDate.valueOf();
    const expiryDate = e.equExpiryDate.valueOf();
    const allValues = form.getFieldsValue(true);

    const { equManufactureDate, equExpiryDate, ...otherValues } = allValues;

    const equData = {
      id: id,
      ...otherValues,
      equManufactureDate: manufactureDate,
      equExpiryDate: expiryDate,
      equStatus: 1,
    };

    const maintData = {
      id: id,
      // lastMaintenanceDate: manufactureDate,
      // nextMaintenanceDate: expiryDate,
      // status: "Scheduled",
    };

    set(equRef, equData)
      .then(() => {
        return set(maintRef, maintData);
      })
      .then(() => {
        toast.success("Add new equip successfully");
        setIsOpenModal(false);
      })
      .catch((err) => {
        toast.error("Error adding data: " + err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = (e) => {
    setIsLoading(true);
    const equManufactureDate = e.manufactureDate ? e.manufactureDate.valueOf() : null;
    const equExpiryDate = e.expiryDate ? e.expiryDate.valueOf() : null;
    // console.log("equManufactureDate: ", manufactureDate);
    const allValues = form.getFieldsValue(true);

    const { manufactureDate, expiryDate, ...otherValues } = allValues;
    const postData = {
      ...otherValues,
    };
    if (equManufactureDate !== null)
      postData.equManufactureDate = equManufactureDate;

    if (equExpiryDate !== null)
      postData.equExpiryDate = equExpiryDate;

    const updates = {};
    updates["/equ/" + form.getFieldValue("id")] = postData;

    return update(ref(realtimeDB), updates)
      .then(toast.success("Update Equip successfully"), setIsOpenModal(false), setIsLoading(false))
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleCancel = (e) => {
    setIsOpenModal(false);
  };

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
            <Button loading={isLoading} htmlType="submit" form="equ_form" className="bg-orange text-white">{isAddModal ? "Add Equip" : "Save Equip"}</Button>
          </>
        )}>
        <h1 className="text-3xl font-bold mb-4 text-orange text-center">{isAddModal ? "ADD EQUIP" : "EDIT EQUIP"}</h1>
        <div className="flex items-center text-center mb-4">
          <div>
            <span className="text-2xl font-medium mb-4 text-orange justify-start">
              Equip Status
            </span>
          </div>
          {form.getFieldValue("equStatus") === 0 ? (
            <span className="w-1/6 ml-4 px-4 py-2 font-semibold text-sm text-center bg-cyan-600 text-white rounded-full shadow-sm">
              Unknown
            </span>
          ) : form.getFieldValue("equStatus") === 1 ? (
            <span className="w-1/6 ml-4 px-4 py-2 font-semibold text-sm text-center bg-green-400 text-white rounded-full shadow-sm">
              Activating
            </span>
          ) : form.getFieldValue("equStatus") === 2 ? (
            <span className="w-1/6 ml-4 px-4 py-2 font-semibold text-sm text-center bg-yellow-500 text-white rounded-full shadow-sm">
              Under repair
            </span>
          ) : form.getFieldValue("equStatus") === 3 ? (
            <span className="w-1/6 ml-4 px-4 py-2 font-semibold text-sm text-center bg-red-500 text-white rounded-full shadow-sm">
              Defective
            </span>
          ) : (
            ""
          )}
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={isAddModal ? handleAdd : handleEdit}
          name="equ_form"
          id="equ_form"
          clearOnDestroy
        // onFinish={(values) => onCreate(values)}
        >
          <h2 className="text-2xl font-medium mb-4 text-orange">Equip Infomation</h2>
          <div className="flex gap-4">
            <EquInputField name={"equName"} label={"Name Equip"} type={"text"} />
            {/* <EquInputField name={"equManufactureDate"} label={"Manufacture Date"} type={"number"} /> */}
            <div className="w-1/2">
              <Form.Item
                name={isAddModal ? "equManufactureDate" : "manufactureDate"}
                label="Manufacture Date"
                rules={[
                  {
                    required: isAddModal ? true : false,
                    message: "Please input the Manufacture Date",
                  },
                ]}
              >
                <DatePicker defaultValue={isAddModal ? null : dayjs(equManufactureDate)} size="large" />
              </Form.Item>
            </div>
          </div>

          <div className="flex gap-4">
            <EquInputField name={"equPrice"} label={"Price"} type={"number"} />
            <EquInputField name={"equQuantity"} label={"Quantity"} type={"number"} />
            {/* <equSelectField name={"equHighSchoolLocation"} label={"High School Location"} listSelect={locationList} form={form} isAddModal={isAddModal}/> */}
          </div>

          <div className="flex gap-4">
            <EquInputField name={"equManufacturer"} label={"Manufacturer"} type={"text"} />
            {/* <EquInputField name={"equExpiryDate"} label={"Expiry Date"} type={"number"} /> */}
            <div className="w-1/2">
              <Form.Item
                name={isAddModal ? "equExpiryDate" : "expiryDate"}
                label="Expiry Date"
                rules={[
                  {
                    required: isAddModal ? true : false,
                    message: "Please input the Expiry Date",
                  },
                ]}
              >
                <DatePicker defaultValue={isAddModal ? null : dayjs(equExpiryDate)} size="large" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default EquModal