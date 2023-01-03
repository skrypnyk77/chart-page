import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import api from "../../data/batteryApi";

import { useStores } from "../../use-stores";

import { Column } from "@ant-design/plots";
import {
  Select,
  Typography,
  Space,
  Radio,
  Button,
  Spin,
  DatePicker,
} from "antd";
import moment, { Moment } from "moment";
import type { RadioChangeEvent } from "antd";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

export const BatteryLevel = observer(() => {
  const {
    groupsStore: { groupsData },
    lampsStore: { lampsData },
    systemsStore: { systemsData },
  } = useStores();

  const groupsDataOptions = groupsData?.map((item: any) => {
    return {
      value: item.id,
      label: item.code,
      ...item,
    };
  });

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
    detalization: "1d",
    ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
    ["date[end]"]: moment(new Date()).format(dateTimeFormat),
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

  // groups filter
  const handleChangeGroups = (value: string[]): void => {
    setFilters({
      ...filters,
      group: value && value.length > 0 ? value : undefined,
    });
  };

  // lamps filter
  const handleChangeLamps = (value: string[]): void => {
    setFilters({
      ...filters,
      lamp: value && value.length > 0 ? value : undefined,
    });
  };

  // systems filter
  const handleChangeSystems = (value: string[]): void => {
    setFilters({
      ...filters,
      system: value && value.length > 0 ? value : undefined,
    });
  };

  // detalization filter
  const onDetalizationChange = (event: RadioChangeEvent): void => {
    setFilters({
      ...filters,
      detalization: event.target.value,
    });
  };

  //date[from/to] filter
  const onDateFromChange = (
    value: [Moment, Moment],
    dateString: [string, string]
  ): void => {
    if (value === null) {
      setFilters({
        ...filters,
        ["date[start]"]: defaultFilters["date[start]"],
        ["date[end]"]: defaultFilters["date[end]"],
      });
    } else {
      setFilters({
        ...filters,
        ["date[start]"]: dateString[0],
        ["date[end]"]: dateString[1],
      });
    }
  };

  const onQuickPresetChange = (preset: string) => {
    if (preset === "day") {
      setFilters({
        ...filters,
        ["date[start]"]: moment().add(-1, "day").format(dateTimeFormat),
        ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      });
    } else if (preset === "week") {
      setFilters({
        ...filters,
        ["date[start]"]: moment().add(-7, "day").format(dateTimeFormat),
        ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      });
    } else if (preset === "month") {
      setFilters({
        ...filters,
        ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
        ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      });
    } else if (preset === "quarter") {
      setFilters({
        ...filters,
        ["date[start]"]: moment().add(-3, "month").format(dateTimeFormat),
        ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      });
    }
  };

  //submit filters
  const submitFilters = async (): Promise<void> => {
    setBatteryLevelLoading(true);

    try {
      const data = await api.getBatteryLevel({
        ...filters,
      });

      setBatteryLevel(data);
    } catch (error) {
      console.log(error);
    }

    setBatteryLevelLoading(false);
  };

  //reset filters
  const resetFilters = async (): Promise<void> => {
    setBatteryLevelLoading(true);

    try {
      setFilters({
        ...defaultFilters,
        group: undefined,
        lamp: undefined,
        system: undefined,
      });

      const data = await api.getBatteryLevel({
        ...defaultFilters,
        group: undefined,
        lamp: undefined,
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

      <Space style={{ marginBottom: "16px" }}>
        <Text style={{ width: "100px", display: "block" }}>Detalization</Text>
        <Radio.Group
          defaultValue="1d"
          buttonStyle="solid"
          value={filters.detalization || undefined}
          onChange={onDetalizationChange}
        >
          <Radio.Button value="1w">Week</Radio.Button>
          <Radio.Button defaultChecked value="1d">
            Day
          </Radio.Button>
          <Radio.Button value="1h">Hour</Radio.Button>
        </Radio.Group>
      </Space>

      <Space style={{ marginBottom: "16px" }}>
        <Text style={{ width: "100px", display: "block" }}>Date [From/To]</Text>
        <RangePicker
          style={{
            width: "360px",
            flex: 1,
          }}
          renderExtraFooter={() => (
            <Space>
              <Button
                size="small"
                type="primary"
                onClick={() => onQuickPresetChange("day")}
              >
                Today
              </Button>
              <Button size="small" onClick={() => onQuickPresetChange("week")}>This Week</Button>
              <Button size="small" type="primary" onClick={() => onQuickPresetChange("month")}>
                This Month
              </Button>
              <Button size="small" onClick={() => onQuickPresetChange("quarter")}>90 Days</Button>
            </Space>
          )}
          showTime={filters.detalization === "1h" ? true : false}
          format={dateTimeFormat}
          placeholder={["Start Date", "End Date"]}
          value={[
            moment(filters["date[start]"], dateTimeFormat),
            moment(filters["date[end]"], dateTimeFormat),
          ]}
          onChange={onDateFromChange}
        />
      </Space>

      <Space style={{ marginBottom: "16px" }}>
        <Text style={{ width: "100px", display: "block" }}>Systems</Text>
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

      <Space style={{ marginBottom: "16px" }}>
        <Text style={{ width: "100px", display: "block" }}>Groups</Text>
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => (option?.name ?? "").includes(input)}
          mode="multiple"
          style={{
            width: "360px",
            flex: 1,
          }}
          value={filters.group || undefined}
          options={groupsDataOptions}
          placeholder="Select Group(s)"
          onChange={handleChangeGroups}
        />
      </Space>

      <Space style={{ marginBottom: "16px" }}>
        <Text style={{ width: "100px", display: "block" }}>Lamps</Text>
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => (option?.name ?? "").includes(input)}
          mode="multiple"
          style={{
            width: "360px",
            flex: 1,
          }}
          value={filters.lamp || undefined}
          options={lampsDataOptions}
          placeholder="Select Lamp(s)"
          onChange={handleChangeLamps}
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
