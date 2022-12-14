import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import api from "../../data/batteryApi";

import { useStores } from "../../use-stores";

import { Column } from "@ant-design/plots";
import { Select, Typography, Space, Radio, Button, Form, Spin } from "antd";

const { Title } = Typography;
// const { Option } = Select;

export const TotalIlluminationTime = observer(() => {
  const {
    lampsStore: { lampsData },
  } = useStores();

  const lampsDataOptions = lampsData?.map((item: any) => {
    return {
      value: item.attributes._id,
      label: item.attributes.name,
      ...item,
    };
  });

  const [batteryLevelLoading, setBatteryLevelLoading] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    async function asyncGetBatteryLevel() {
      setBatteryLevelLoading(true);

      try {
        const data = await api.getBatteryLevel({
          detalization: "1d",
          ["date[start]"]: "2022-11-10",
          ["date[end]"]: "2022-12-10",
        });

        setBatteryLevel(data);
      } catch (err) {
        console.log(err);
      }

      setBatteryLevelLoading(false);
    }

    asyncGetBatteryLevel();
  }, []);

  const config = {
    data: batteryLevel,
    xField: "date",
    yField: "batteryLevel",
    columnWidthRatio: 0.8,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  const handleChangeLamps = (value) => {
    console.log(value);

    setFilters({ lamps: value && value.length > 0 ? value : undefined });
  };

  return (
    <>
      <Title>Battery Level</Title>

      <Space style={{ width: "100%" }}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          // onValuesChange={onFormLayoutChange}
        >
          {/* <Form.Item label="Form Size" name="size">
            <Radio.Group>
              <Radio.Button value="small">Small</Radio.Button>
              <Radio.Button value="default">Default</Radio.Button>
              <Radio.Button value="large">Large</Radio.Button>
            </Radio.Group>
          </Form.Item> */}

          {/* <Form.Item label="Lamps">
            <Select
              mode="multiple"
              style={{
                width: "300px",
                flex: 1,
              }}
              options={lampsDataOptions}
              placeholder="Select Lamp(s)"
              onChange={handleChangeLamps}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Search</Button>
          </Form.Item> */}
        </Form>
      </Space>

      <br />

      {batteryLevelLoading ? (
        <Spin tip="Loading...">
          <Column {...config} />
        </Spin>
      ) : (
        <Column {...config} />
      )}
    </>
  );
});
