import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import userApi from "../data/userApi";

import {
  notification,
  Layout,
  Typography,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Spin,
  Button,
  Modal,
  Select,
} from "antd";

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
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const UsersList = observer(() => {
  const [form] = Form.useForm();
  const [key, setKey] = useState(0);
  const [editingKey, setEditingKey] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser>({});
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = async (values: any) => {
    console.log("Success:", values);

    await asyncCreateUser({
      ...values,
    });

    await asyncGetUsers();

    setKey(key + 1);

    setIsModalOpen(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const isEditing = (record: Item) => record.key === editingKey;

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
      const row = (await form.validateFields()) as Item;

      await userApi.updateUser({
        id: record.id,
        ...row,
        login: "johndoe",
        roles: ["ROLE_USER"],
        password: "string",
        name: "John Doe",
        note: "string",
        available_systems: [1],
      });

      await asyncGetUsers();

      setEditingKey("");
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

  const editRow = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });

    setEditingKey(record.key);
  };

  const cancelRowUpdates = () => {
    setEditingKey("");
  };

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
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Typography.Link
              onClick={() => asyncUpdateUser(record)}
              style={{ marginRight: 8 }}
            >
              Update
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelRowUpdates}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => editRow(record)}
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

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
          onClick={() => setIsModalOpen(true)}
        >
          Create User
        </Button>
        <Modal
          title="Create User"
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
            initialValues={{ remember: true }}
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
                options={[]}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit">
                Create
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
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={users}
            columns={mergedColumns}
          />
        </Form>
      )}
    </Layout>
  );
});

export default UsersList;
