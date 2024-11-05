import { Form, Input } from 'antd';
import React from 'react'

function ProfileInputField({ name, label }) {
   const checkType = (_, value) => {
      if (name === "userEmail") return validatorEmail(_, value);
      if (name === "userPhone") return validatorPhone(_, value);
      return Promise.resolve();
   };

   const validatorEmail = (_, value) => {
      if (!value) return Promise.resolve();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value))
         return Promise.reject(new Error("The input is not valid email"));
      return Promise.resolve();
   };

   const validatorPhone = (_, value) => {
      if (!value) return Promise.resolve();
      const phoneRegex = /^0[0-9]{9}$/;
      if (!phoneRegex.test(value))
         return Promise.reject(
            new Error("Please enter a valid 10-digit phone number and start with 0")
         );
      return Promise.resolve();
   };

   return (
      <div className="">
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
            <Input size="large" />
         </Form.Item>
      </div>
   )
}

export default ProfileInputField