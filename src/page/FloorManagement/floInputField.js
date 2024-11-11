import { Form, Input } from 'antd';
import React from 'react';

function FloInputField({ name, label, type }) {
  return (
    <div className="w-1/2">
      <Form.Item
        name={name}
        label={label}
        rules={[
          {
            required: name !== "floDescription" ? true : false,
            message: "Please input the " + label,
          },
        ]}
      >
        <Input size="large" type={type} placeholder={`Enter ${label}`} />
      </Form.Item>
    </div>
  );
}

export default FloInputField;
