import { Button, DatePicker, Form, Input, Modal } from 'antd'
import { child, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { realtimeDB } from '../../firebase';
import EquInputField from './equInputField';
import { toast } from "react-toastify";
import moment from 'moment';

function EquModal({ isOpenModal, isAddModal, setIsOpenModal, form }) {
    const equList = useSelector((state) => state.equip?.equ?.allEqu);
    const equManufactureDate = form?.getFieldValue("equManufactureDate");
    const equExpiryDate = form?.getFieldValue("equExpiryDate");
    useEffect(() => {

    }, []);

    const handleAdd = (e) => {
        const id = [...equList].pop().id + 1;
        const equRef = child(ref(realtimeDB), "equ/" + id);
        const manufactureDate = e.equManufactureDate.toISOString();
        const expiryDate = e.equExpiryDate.toISOString();
        // console.log("equManufactureDate: ", manufactureDate);
        const allValues = form.getFieldsValue(true);

        const { equManufactureDate, equExpiryDate, ...otherValues } = allValues;

        set(equRef, {
            id: id,
            ...otherValues,
            equManufactureDate: manufactureDate,
            equExpiryDate: expiryDate,
            equStatus: "1"
        })
            .then(toast.success("Add new equip success"), setIsOpenModal(false))
            .catch((err) => {
                toast.error(err);
            });
    };

    const handleEdit = (e) => {
        const manufactureDate = e.equManufactureDate.toISOString();
        const expiryDate = e.equExpiryDate.toISOString();
        // console.log("equManufactureDate: ", manufactureDate);
        const allValues = form.getFieldsValue(true);

        const { equManufactureDate, equExpiryDate, ...otherValues } = allValues;
        const postData = {
            ...otherValues,
            equManufactureDate: manufactureDate,
            equExpiryDate: expiryDate,
        };

        const updates = {};
        updates["/equ/" + form.getFieldValue("id")] = postData;

        return update(ref(realtimeDB), updates)
            .then(toast.success("Update Equip success"), setIsOpenModal(false))
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
                        <Button htmlType="submit" form="equ_form" className="bg-orange">{isAddModal ? "Add Equip" : "Save Equip"}</Button>
                    </>
                )}>
                <h1 className="text-3xl font-bold mb-4 text-orange text-center">{isAddModal ? "ADD EQUIP" : "EDIT EQUIP"}</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={isAddModal ? handleAdd : handleEdit}
                    name="equ_form"
                    id="equ_form"
                    initialValues={{
                        modifier: "public",
                    }}
                    clearOnDestroy
                // onFinish={(values) => onCreate(values)}
                >
                    <h2 className="text-2xl font-medium mb-4 text-orange">Equip Infomation</h2>
                    <div className="flex gap-4">
                        <EquInputField name={"equName"} label={"Name Equip"} type={"text"} />
                        {/* <EquInputField name={"equManufactureDate"} label={"Manufacture Date"} type={"number"} /> */}
                        <div className="w-1/2">
                            <Form.Item
                                name="equManufactureDate"
                                label="Manufacture Date"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input the Manufacture Date",
                                    },
                                ]}
                            >
                                <DatePicker value={equManufactureDate ? moment(equManufactureDate) : null} size="large" />
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
                                name="equExpiryDate"
                                label="Expiry Date"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input the Expiry Date",
                                    },
                                ]}
                            >
                                <DatePicker value={equExpiryDate ? moment(equExpiryDate) : null} size="large" />
                            </Form.Item>
                        </div>
                        {/* <equSelectField name={"equConduct"} label={"Conduct"} listSelect={listConduct} form={form} isAddModal={false}/> */}

                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default EquModal