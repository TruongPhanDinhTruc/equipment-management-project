import { Button, Form, Input, Modal } from 'antd'
import { child, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { realtimeDB } from '../../firebase';
import EquInputField from './equInputField';
import { toast } from "react-toastify";

function EquModal({ isOpenModal, isAddModal, setIsOpenModal, form }) {
    const equList = useSelector((state) => state.equip?.equ?.allEqu);

    console.log("equList: ", equList);
    
    useEffect(() => {

    }, []);

    const handleAdd = (e) => {
        const id = [...equList].pop().id + 1;
        const equRef = child(ref(realtimeDB), "equ/" + id);
        
        set(equRef, {
            id: id,
            ...form.getFieldsValue(true),
            equStatus: "1"
        })
            .then(toast.success("Add new equip success"), setIsOpenModal(false))
            .catch((err) => {
                toast.error(err);
            });
    };

    const handleEdit = (e) => {
        const postData = {
            ...form.getFieldsValue(true),
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

    const listConduct = [
        { value: "V", label: "V (Very Good)", },
        { value: "G", label: "G (Good)", },
        { value: "A", label: "A (Average)", },
        { value: "W", label: "W (Weak)", },
    ];

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
                    <h2 className="text-2xl font-medium mb-4 text-orange">Personal Academic Profile</h2>
                    <div className="flex gap-4">
                        <EquInputField name={"equName"} label={"Name Equip"} type={"text"} />
                        <EquInputField name={"equManufactureDate"} label={"Manufacture Date"} type={"number"} />
                    </div>

                    <div className="flex gap-4">
                        <EquInputField name={"equPrice"} label={"Price"} type={"number"} />
                        <EquInputField name={"equQuantity"} label={"Quantity"} type={"number"} />
                        {/* <equSelectField name={"equHighSchoolLocation"} label={"High School Location"} listSelect={locationList} form={form} isAddModal={isAddModal}/> */}

                    </div>

                    <div className="flex gap-4">
                        <EquInputField name={"equManufacturer"} label={"Manufacturer"} type={"text"} />
                        <EquInputField name={"equExpiryDate"} label={"Expiry Date"} type={"number"} />

                        {/* <equSelectField name={"equConduct"} label={"Conduct"} listSelect={listConduct} form={form} isAddModal={false}/> */}

                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default EquModal