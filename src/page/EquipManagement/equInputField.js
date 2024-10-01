import { Form, Input } from 'antd'
import React from 'react'

function EquInputField({ name, label, type }) {
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
                ]}
            >
                <Input size="large" type={type} />
            </Form.Item>
        </div>
    )
}

export default EquInputField