import React, { useState } from "react";
import { observer } from "mobx-react";
import { useStores } from "../use-stores";
import userApi from "../data/userApi";

import { Layout, Card, Button, Modal, Form, Input } from "antd";

const Profile = observer(() => {
  const {
    userStore: { user, getMe },
  } = useStores();

  const [key, setKey] = useState(0);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const onFinish = async (values: any) => {
    console.log("Success:", values);

    await userApi.updateUser({ ...user, ...values });

    await getMe();

    setKey(key + 1);

    setShowChangePasswordModal(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout style={{ padding: 20 }}>
      <Modal
        title="Create User"
        open={showChangePasswordModal}
        onCancel={() => setShowChangePasswordModal(false)}
        footer={null}
      >
        <Form
          key={key}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password placeholder="Enter Password" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Change
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Card
        title={user.name}
        extra={
          <Button onClick={() => setShowChangePasswordModal(true)} type="primary">
            Change Password
          </Button>
        }
      >
        <p>
          <strong style={{ marginRight: 10 }}>ID:</strong>
          {user.id}
        </p>
        <p>
          <strong style={{ marginRight: 10 }}>Login:</strong>
          {user.login}
        </p>
        <p>
          <strong style={{ marginRight: 10 }}>Roles:</strong>
          {user.roles.join(", ")}
        </p>
        <p>
          <strong style={{ marginRight: 10 }}>Available Systems:</strong>
          {user.available_systems.length > 0
            ? user.available_systems.map((item) => {
                return `${item.name}, `;
              })
            : "-"}
        </p>
      </Card>
    </Layout>
  );
});

export default Profile;
