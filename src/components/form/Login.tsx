import React from "react";
import { Form, Input } from "antd";

const Login = ({ form }) => {
  const { setFieldsValue } = form;

  React.useEffect(() => {}, [setFieldsValue]);

  return (
    <Form.Item label="Login" name="login">
      <Input placeholder="custom" />
    </Form.Item>
  );
};

export default Login;
