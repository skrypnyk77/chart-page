import React, { useState } from "react";
import { observer } from "mobx-react";
import { useStores } from "../use-stores";
import userApi from "../data/userApi";

import { notification, Layout, Card, Button, Modal, Form, Input } from "antd";

type NotificationType = "success" | "error";

const Profile = observer(() => {
  const {
    userStore: { user, getMe },
  } = useStores();

  const [key, setKey] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const openNotificationWithIcon = (
    type: NotificationType,
    description: string
  ) => {
    api[type]({
      message: type.charAt(0).toUpperCase() + type.slice(1),
      description: description,
    });
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);

    console.log(values);

    await userApi.updateUser({ ...values, confirmPassword: undefined, id: user.id });

    await getMe();

    setKey(key + 1);

    setShowChangePasswordModal(false);

    openNotificationWithIcon("success", "You succesfully changed the password");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout style={{ padding: 20 }}>
      {contextHolder}

      <Modal
        width={640}
        title="Change password"
        open={showChangePasswordModal}
        onCancel={() => {
          setKey(key + 1);
          setShowChangePasswordModal(false);
        }}
        footer={null}
      >
        <Form
          key={key}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input password!" },
              { min: 8 },
              {
                pattern: new RegExp(/^\S+$/),
                message: "No space allowed",
              },
            ]}
          >
            <Input.Password placeholder="Enter Password" />
          </Form.Item>

          <Form.Item
            label="Repeat new password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please input password!" },
              { min: 8 },
              {
                pattern: new RegExp(/^\S+$/),
                message: "No space allowed",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The password confirmation does not match.")
                  );
                },
              }),
            ]}
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
        title={user?.name}
        extra={
          <Button
            onClick={() => setShowChangePasswordModal(true)}
            type="primary"
          >
            Change Password
          </Button>
        }
      >
        <p>
          <strong style={{ marginRight: 10 }}>Login:</strong>
          {user?.login}
        </p>
        <p>
          <strong style={{ marginRight: 10 }}>Roles:</strong>
          {user?.roles?.join(", ")}
        </p>
        <p>
          <strong style={{ marginRight: 10 }}>Available Systems:</strong>
          {user?.available_systems?.length > 0
            ? user?.available_systems?.map((item) => {
                return `${item.name}, `;
              })
            : "-"}
        </p>
      </Card>
    </Layout>
  );
});

export default Profile;
