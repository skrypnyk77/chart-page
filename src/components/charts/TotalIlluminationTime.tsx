import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import api from "../../data/batteryApi";

import { useStores } from "../../use-stores";

import { Column } from "@ant-design/plots";
import { Select, Typography, Space, Radio, Button, Spin } from "antd";
import type { RadioChangeEvent } from "antd";

const { Title, Text } = Typography;

export const TotalIlluminationTime = observer(() => {
  const {
    lampsStore: { lampsData },
    systemsStore: { systemsData },
  } = useStores();

  const lampsDataOptions = lampsData?.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
      ...item,
    };
  });

  const systemsDataOptions = systemsData?.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
      ...item,
    };
  });

  const defaultFilters = {
    detalization: "1w",
    ["date[start]"]: "2022-11-10",
    ["date[end]"]: "2022-12-10",
  };

  const [batteryLevelLoading, setBatteryLevelLoading] = useState(false);

  const [batteryLevel, setBatteryLevel] = useState([]);
  const [filters, setFilters] = useState({ ...defaultFilters });

  useEffect(() => {
    async function asyncGetBatteryLevel() {
      setBatteryLevelLoading(true);

      try {
        const data = await api.getBatteryLevel({
          ...defaultFilters,
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

  const handleChangeLamps = (value: string[]) => {
    setFilters({
      ...filters,
      lamps: value && value.length > 0 ? value : undefined,
    });
  };

  const handleChangeSystems = (value: string[]) => {
    setFilters({
      ...filters,
      system: value && value.length > 0 ? value : undefined,
    });
  };

  const onDetalizationChange = (event: RadioChangeEvent) => {
    setFilters({
      ...filters,
      detalization: event.target.value,
    });
  };

  const submitFilters = async () => {
    setBatteryLevelLoading(true);

    try {
      const data = await api.getBatteryLevel({
        ...filters,
      });

      setBatteryLevel(data);
    } catch (error) {
      console.warn(error);
    }

    setBatteryLevelLoading(false);
  };

  const resetFilters = async () => {
    setBatteryLevelLoading(true);

    setFilters({ ...defaultFilters });

    try {
      const data = await api.getBatteryLevel({
        ...defaultFilters,
        lamps: undefined,
        system: undefined,
      });

      setBatteryLevel(data);
    } catch (err) {
      console.log(err);
    }

    setBatteryLevelLoading(false);
  };

  return (
    <>
      <Title style={{ marginBottom: "24px" }}>Battery Level</Title>

      <Space style={{ marginBottom: "24px" }}>
        <Text>Detalization</Text>
        <Radio.Group
          defaultValue="1w"
          buttonStyle="solid"
          value={filters.detalization || undefined}
          onChange={onDetalizationChange}
        >
          <Radio.Button defaultChecked value="1w">
            Week
          </Radio.Button>
          <Radio.Button value="1d">Day</Radio.Button>
          <Radio.Button value="1h">Hour</Radio.Button>
        </Radio.Group>
      </Space>

      <Space style={{ marginBottom: "24px" }}>
        <Text>Lamps...</Text>
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => (option?.name ?? "").includes(input)}
          mode="multiple"
          style={{
            width: "360px",
            flex: 1,
          }}
          value={filters.lamps || undefined}
          options={lampsDataOptions}
          placeholder="Select Lamp(s)"
          onChange={handleChangeLamps}
        />
      </Space>

      <Space style={{ marginBottom: "24px" }}>
        <Text>Systems</Text>
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => (option?.name ?? "").includes(input)}
          mode="multiple"
          style={{
            width: "360px",
            flex: 1,
          }}
          value={filters.system || undefined}
          options={systemsDataOptions}
          placeholder="Select Systems(s)"
          onChange={handleChangeSystems}
        />
      </Space>

      <Space>
        <Button style={{ width: "100px" }} onClick={resetFilters}>
          Reset
        </Button>

        <Button
          type="primary"
          style={{ width: "100px" }}
          onClick={submitFilters}
        >
          Search
        </Button>
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
