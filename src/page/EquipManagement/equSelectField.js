import { Form, Select } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux';

function EquSelectField({listSelect, name, label, form, isAddModal}) {
  return (
    <div className="w-1/2">
        <Form.Item
            name={name}
            label={label}
            defaultValue={
                isAddModal ? "" : ""
            }
            rules={[
                {
                    required: true,
                    message: "Please input the " + label,
                },
            ]}
        >
            <Select
                showSearch
                size="medium"
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

export default EquSelectField