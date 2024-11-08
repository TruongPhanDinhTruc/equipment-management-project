import { Form, Input } from 'antd';
import React from 'react'

function LocInputField({ name, label, type }) {
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
                        // validator: checkType
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
                <Input size="large" type={type} />
            </Form.Item>
        </div>
  )
}

export default LocInputField