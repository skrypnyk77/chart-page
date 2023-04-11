import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import userApi from "../data/userApi";
import { useStores } from "../use-stores";

import {
  notification,
  Layout,
  Typography,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Spin,
  Button,
  Modal,
  Select,
} from "antd";

// import Login from "./form/Login";

const { Title } = Typography;

type NotificationType = "success" | "error";

interface CurrentUser {
  id: number;
  login: string;
  roles: string[];
  name: string;
  note: string;
  created_at: string;
  modified_at: string;
  available_systems: AvailableSystem[];
}

interface AvailableSystem {
  code: string;
  created_at: string;
  id: number;
  name: string;
}

interface Item {
  key: number;
  available_systems: any[];
  created_at: string;
  id: number;
  login: string;
  modified_at: string;
  roles: string[];
  name: string;
  note: string;
}

const UsersList = observer(() => {
  const {
    systemsStore: { systemsData },
  } = useStores();

  const systemsOptions = systemsData.map((item) => {
    return { id: item.id, value: item.id, label: item.name };
  });

  const [form] = Form.useForm();
  const [key, setKey] = useState(0);

  // const [currentUser, setCurrentUser] = useState<CurrentUser>({});
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const onFinish = async (values: any) => {
    console.log("Success:", values);

    const available_systems = [];

    if (!editMode) {
      values.available_systems.forEach((system) =>
        available_systems.push(`/api/systems/${system}`)
      );
    }

    editMode
      ? await asyncUpdateUser({
          id: 18,
          login: "johndoe",
          roles: ["ROLE_USER"],
          password: "string",
          name: "John Doe",
          note: "string",
          available_systems: ["/api/systems/4"],
        })
      : await asyncCreateUser({
          ...values,
          available_systems: available_systems,
        });

    await asyncGetUsers();

    setKey(key + 1);

    setIsModalOpen(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    description: string
  ) => {
    api[type]({
      message: type.charAt(0).toUpperCase() + type.slice(1),
      description: description,
    });
  };

  async function asyncGetUsers() {
    setIsLoading(true);

    try {
      const users = await userApi.getUsers();

      const mapped = users.map((item: Item) => {
        return { key: item.id, ...item };
      });

      setUsers(mapped);

      console.log("users", users);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  async function asyncCreateUser(params: any) {
    setIsLoading(true);

    try {
      await userApi.createUser(params);

      await asyncGetUsers();

      openNotificationWithIcon("success", "You succesfully created the user");
    } catch (error) {
      console.log(error);

      openNotificationWithIcon("error", "Something went wrong");
    }

    setIsLoading(false);
  }

  async function asyncUpdateUser(record: Item) {
    try {
      // const row = (await form.validateFields()) as Item;

      await userApi.updateUser(record);

      await asyncGetUsers();
    } catch (error) {
      console.log(error);
    }
  }

  async function asyncDeleteUser(id: string) {
    setIsLoading(true);

    try {
      await userApi.deleteUser(id);

      await asyncGetUsers();
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    asyncGetUsers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      editable: false,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
      editable: true,
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      editable: false,
      render: (_: any, record: Item) => {
        return record.roles?.join(", ");
      },
    },
    {
      title: "Available Systems",
      dataIndex: "available_systems",
      key: "available_systems",
      editable: false,
      render: (_: any, record: Item) => {
        const availableSystemsNames: string[] = [];

        record.available_systems?.forEach((item: AvailableSystem) =>
          availableSystemsNames.push(item.name)
        );

        return availableSystemsNames.length > 0
          ? availableSystemsNames?.join(", ")
          : "-";
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      key: "operation",
      width: "160px",
      render: (_: any, record: Item) => {
        return (
          <Space>
            <Typography.Link
              onClick={() => {
                setIsModalOpen(true);
                setEditMode(true);

                let roles = [];

                record.roles?.forEach((item) =>
                  roles.push({ value: item, label: item })
                );

                form.setFieldsValue({
                  id: record.id,
                  login: record.login,
                  password: "",
                  name: record.name,
                  note: "",
                  roles: roles,
                  available_systems: record.available_systems,
                });
              }}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => asyncDeleteUser(record.id)}
            >
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Layout style={{ padding: 20 }}>
      {contextHolder}

      <Title style={{ marginBottom: "24px" }} level={2}>
        Users
      </Title>

      <Space style={{ justifyContent: "flex-end", marginBottom: "20px" }}>
        <Button
          style={{ width: "120px" }}
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
            setEditMode(false);
          }}
        >
          Create User
        </Button>
        <Modal
          title={editMode ? "Edit User" : "Create User"}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            key={key}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Login"
              name="login"
              rules={[{ required: true, message: "Please input login!" }]}
            >
              <Input placeholder="Enter Login" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input password!" }]}
            >
              <Input.Password placeholder="Enter Password" />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input name!" }]}
            >
              <Input placeholder="Enter Name" />
            </Form.Item>

            <Form.Item label="Note" name="note">
              <Input placeholder="Enter Note" />
            </Form.Item>

            <Form.Item label="Roles" name="roles">
              <Select
                showSearch={false}
                showArrow
                placeholder="Select Role(s)"
                mode="multiple"
                options={[
                  { label: "ROLE_USER", value: "ROLE_USER" },
                  { label: "ROLE_ADMIN", value: "ROLE_ADMIN" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Systems" name="available_systems">
              <Select
                placeholder="Select System(s)"
                mode="multiple"
                showSearch
                showArrow
                optionFilterProp="label"
                options={systemsOptions}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit">
                {editMode ? "Edit" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>

      {isLoading ? (
        <div
          style={{
            margin: "350px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} component={false}>
          <Table bordered dataSource={users} columns={columns} />
        </Form>
      )}
    </Layout>
  );
});

export default UsersList;
