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
    const equManufactureDate = form?.getFieldValue("equManufactureDate");
    const equExpiryDate = form?.getFieldValue("equExpiryDate");
    useEffect(() => {

    }, []);

    const handleAdd = (e) => {
        const id = [...equList].pop().id + 1;
        const equRef = child(ref(realtimeDB), "equ/" + id);
        const manufactureDate = e.equManufactureDate.valueOf();
        const expiryDate = e.equExpiryDate.valueOf();
        // console.log("equManufactureDate: ", manufactureDate);
        const allValues = form.getFieldsValue(true);

        const { equManufactureDate, equExpiryDate, ...otherValues } = allValues;

        set(equRef, {
            id: id,
            ...otherValues,
            equManufactureDate: manufactureDate,
            equExpiryDate: expiryDate,
            equStatus: 1
        })
            .then(toast.success("Add new equip success"), setIsOpenModal(false))
            .catch((err) => {
                toast.error(err);
            });
    };

    const handleEdit = (e) => {
        const equManufactureDate = e.manufactureDate ? e.manufactureDate.valueOf() : null;
        const equExpiryDate = e.expiryDate ? e.expiryDate.valueOf() : null;
        // console.log("equManufactureDate: ", manufactureDate);
        const allValues = form.getFieldsValue(true);

        const { manufactureDate, expiryDate, ...otherValues } = allValues;
        const postData = {
            ...otherValues,
            // equManufactureDate: equManufactureDate,
            // equExpiryDate: equExpiryDate,
        };
        if (equManufactureDate !== null) {
            postData.equManufactureDate = equManufactureDate;
        }

        // Chỉ thêm equExpiryDate nếu nó không null
        if (equExpiryDate !== null) {
            postData.equExpiryDate = equExpiryDate;
        }
        const updates = {};
        updates["/equ/" + form.getFieldValue("id")] = postData;

        return update(ref(realtimeDB), updates)
            .then(toast.success("Update Equip successfully"), setIsOpenModal(false))
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
                        <Button htmlType="submit" form="equ_form" className="bg-orange text-white">{isAddModal ? "Add Equip" : "Save Equip"}</Button>
                    </>
                )}>
                <h1 className="text-3xl font-bold mb-4 text-orange text-center">{isAddModal ? "ADD EQUIP" : "EDIT EQUIP"}</h1>
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