import { Form, Select } from 'antd'
import React from 'react'

function LocSelectField({ listSelect, name, label }) {
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
                ]}
            >
                <Select
                    // showSearch
                    size="large"
                    filterOption={(input, option) =>
                        (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    placeholder={"Choose " + label}
                    options={listSelect}
                />
            </Form.Item>
        </div>
    )
}

export default LocSelectField