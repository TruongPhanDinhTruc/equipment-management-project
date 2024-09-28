import { Form, Input } from 'antd'
import React from 'react'

function EquInputField({ name, label, type }) {
    const checkType = (_, value) => {
        if (type === "number")
            return validatorGPA(_, value);
        if (type === "email")
            return validatorEmail(_, value);
        if (type === "phone")
            return validatorPhone(_, value);
        if (type === "year")
            return validatorYear(_, value);
        return Promise.resolve();
    }

    const validatorYear = (_, value) => {
        const year = Number(value);
        if (!Number.isInteger(year) || year < 1900 || year > 2900)
            return Promise.reject(new Error("The year must be between 1900 and 2900"));
        return Promise.resolve();
    }

    const validatorPhone = (_, value) => {
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(value))
            return Promise.reject(new Error("Please enter a valid 10-digit phone number and start with 0"));
        return Promise.resolve();
    }

    const validatorEmail = (_, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
            return Promise.reject(new Error("The input is not valid email"));
        return Promise.resolve();
    }

    const validatorGPA = (_, value) => {
        if (value < 0 || value > 10)
            return Promise.reject(new Error("GPA must be between 0 and 10"));
        const decimalPlaces = value.toString().split('.')[1]?.length ?? 0;
        if (decimalPlaces > 2) {
            return Promise.reject(new Error("GPA must have at most two decimal places"));
        }
        return Promise.resolve();
    }
    return (
        <div className="w-1/2">
            <Form.Item
                name={name}
                label={label}
                rules={[
                    {
                        required: true,
                        message: "Please input the " + label,
                    },
                    {
                        validator: checkType
                    },
                ]}
            >
                <Input size="large" type={type} />
            </Form.Item>
        </div>
    )
}

export default EquInputField