import { Form, Input } from 'antd'
import React from 'react'

function EquInputField({ name, label, type }) {
    const checkType = (_, value) => {
        if (name === "equQuantity") return validatorQuantity(_, value);
        if (name === "equPrice") return validatorPrice(_, value);
        return Promise.resolve();
    };

    const validatorQuantity = (_, value) => {
        if (!value) return Promise.resolve();
        if (value <= 0)
            return Promise.reject(new Error(label + " must be greater than 0"));
        if (value > 5)
            return Promise.reject(new Error(label + " must be less than or equal to 5"));
        return Promise.resolve();
    };

    const validatorPrice = (_, value) => {
        if (!value) return Promise.resolve();
        if (value < 0)
            return Promise.reject(new Error(label + " must be greater than 0"));
        return Promise.resolve();
    };

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
                    {
                        // Custom validator to prevent whitespace
                        validator: (_, value) => {
                            if (value && value.trimStart().length !== value.length)
                                return Promise.reject(new Error(label + " cannot start with whitespace"));
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input size="large" suffix={name === "equPrice" ? "VND" : ""} type={type} />
            </Form.Item>
        </div>
    )
}

export default EquInputField