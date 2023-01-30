import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import temperatureApi from "../../data/temperatureApi";
import systemsApi from "../../data/systemsApi";

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

export const Temperature = observer(({ system }) => {
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

  const defaultFilters = {
    detalization: "1d",
    ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
    ["date[end]"]: moment(new Date()).format(dateTimeFormat),
    system: system,
  };

  const [temperatureLoading, setTemperatureLoading] = useState(false);

  const [temperature, setTemperature] = useState([]);
  const [filters, setFilters] = useState({ ...defaultFilters });

  useEffect(() => {
    async function asyncGetTemperature() {
      setTemperatureLoading(true);

      try {
        const data = await temperatureApi.getTemperature({
          ...defaultFilters,
        });

        await getLampsAndGroupsBySystem()

        setTemperature(data);
      } catch (err) {
        console.log(err);
      }

      setTemperatureLoading(false);
    }

    asyncGetTemperature();
  }, []);

  const config = {
    data: temperature,
    xField: "date",
    yField: "temperature",
    columnWidthRatio: 0.8,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  // get Lamps And Groups By System
  const getLampsAndGroupsBySystem = async (): Promise<void> => {
    try {
      const systemData = await systemsApi.getSystemById(system);

      let lampIds = [];
      let groupIds = [];

      if (systemData.lamps) {
        systemData.lamps.forEach((item: any) => {
          lampIds.push(item.id);
        });
      }

      if (systemData.groups_info) {
        systemData.groups_info.forEach((item: any) => {
          groupIds.push(item.group.id);
        });
      }

      setFilters({
        ...filters,
        lamp: lampIds,
        group: groupIds,
      });
    } catch (error) {
      console.log(error);
    }
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
    setTemperatureLoading(true);

    try {
      const data = await temperatureApi.getTemperature({
        ...filters,
      });

      setTemperature(data);
    } catch (error) {
      console.log(error);
    }

    setTemperatureLoading(false);
  };

  //reset filters
  const resetFilters = async (): Promise<void> => {
    setTemperatureLoading(true);

    try {
      setFilters({
        ...defaultFilters,
        group: undefined,
        lamp: undefined,
      });

      const data = await temperatureApi.getTemperature({
        ...defaultFilters,
        group: undefined,
        lamp: undefined,
      });

      await getLampsAndGroupsBySystem()

      setTemperature(data);
    } catch (err) {
      console.log(err);
    }

    setTemperatureLoading(false);
  };

  return (
    <>
      <Title style={{ marginBottom: "24px" }}>Temperature</Title>

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
              <Button size="small" onClick={() => onQuickPresetChange("day")}>
                Day
              </Button>
              <Button size="small" onClick={() => onQuickPresetChange("week")}>
                7 Days
              </Button>
              <Button size="small" onClick={() => onQuickPresetChange("month")}>
                30 Days
              </Button>
              <Button
                size="small"
                onClick={() => onQuickPresetChange("quarter")}
              >
                90 Days
              </Button>
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
            overflowY: "auto",
            maxHeight: "172px",
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

      {temperatureLoading ? (
        <Spin tip="Loading...">
          <Column {...config} />
        </Spin>
      ) : (
        <Column {...config} />
      )}
    </>
  );
});
