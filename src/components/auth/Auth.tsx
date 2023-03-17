import React from "react";
import { Layout, Button, Form, Input, Divider } from "antd";

import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useStores } from "../../use-stores";

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const Auth = observer(() => {
  const navigate = useNavigate();

  const {
    userStore: { login, authError },
  } = useStores();

  const onFinish = async (values: any): Promise<void> => {
    await login({ ...values });

    navigate(`/systems`);
  };

  return (
    <Layout
      style={{ height: "100%", display: "flex", justifyContent: "center" }}
    >
      <Form
        name="basic"
        style={{ minWidth: 480, height: "100%", margin: "200px auto" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h1>Authorization</h1>
        <Divider />
        <Form.Item
          label=""
          name="login"
          rules={[{ required: true, message: "Please input your login." }]}
        >
          <Input placeholder="Login" />
        </Form.Item>

        <Form.Item
          label=""
          name="password"
          rules={[{ required: true, message: "Please input your password." }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          {authError ? <p style={{ color: "#ff4d4f" }}>{authError}</p> : ""}
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
});

export default Auth;
