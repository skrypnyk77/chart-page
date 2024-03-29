import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import illuminationApi from "../../data/illuminationApi";

import { useStores } from "../../use-stores";

import { DualAxes } from "@ant-design/plots";
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

export const IlluminationDuration = observer(({ system, params }) => {
  const {
    groupsStore: { groupsData },
  } = useStores();

  const groupsDataOptions = groupsData?.map((item: any) => {
    return {
      value: item.id,
      label: item.code,
      ...item,
    };
  });

  const defaultFilters = {
    detalization: "1h",
    mode: "total",
    ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
    ["date[end]"]: moment(new Date()).format(dateTimeFormat),
    system: system,
    group: params.group,
  };

  const [illuminationDurationLoading, setIlluminationDurationLoading] =
    useState(false);

  const [illuminationDuration, setIlluminationDuration] = useState([]);
  const [filters, setFilters] = useState({});

  const asyncGetilluminationDuration = async (): Promise<void> => {
    setIlluminationDurationLoading(true);

    try {
      const data = await illuminationApi.getIlluminationDuration({
        ...defaultFilters,
      });

      setFilters({ ...defaultFilters });
      setIlluminationDuration(data);
    } catch (err) {
      console.log(err);
    }

    setIlluminationDurationLoading(false);
  };

  useEffect(() => {
    asyncGetilluminationDuration();
  }, []);

  const config = {
    data: [illuminationDuration, illuminationDuration],
    xField: "date",
    yField: ["hours", "minutes"],
    geometryOptions: [
      {
        geometry: "column",
        isGroup: true,
      },
      {
        geometry: "line",
        lineStyle: {
          lineWidth: 1,
        },
      },
    ],
  };

  // groups filter
  const handleChangeGroups = (value: string[]): void => {
    setFilters({
      ...filters,
      group: value && value.length > 0 ? value : undefined,
    });
  };

  const onModeChange = (event: RadioChangeEvent): void => {
    setFilters({
      ...filters,
      mode: event.target.value,
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
    setIlluminationDurationLoading(true);

    try {
      const data = await illuminationApi.getIlluminationDuration({
        ...filters,
      });

      setIlluminationDuration(data);
    } catch (error) {
      console.log(error);
    }

    setIlluminationDurationLoading(false);
  };

  // reset filters
  const resetFilters = async (): Promise<void> => {
    await asyncGetilluminationDuration();
  };

  return (
    <>
      <Title style={{ marginBottom: "24px" }}>Illumination Duration</Title>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Space style={{ marginBottom: "16px" }}>
          <Text style={{ width: "100px", display: "block" }}>Mode</Text>
          <Radio.Group
            defaultValue="total"
            buttonStyle="solid"
            value={filters.mode || undefined}
            onChange={onModeChange}
          >
            <Radio.Button value="total">Total</Radio.Button>
            <Radio.Button value="per_mode">Per Mode</Radio.Button>
          </Radio.Group>
        </Space>

        <Space style={{ marginBottom: "16px" }}>
          <Text style={{ width: "100px", display: "block" }}>
            Date [From/To]
          </Text>
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
                <Button
                  size="small"
                  onClick={() => onQuickPresetChange("week")}
                >
                  7 Days
                </Button>
                <Button
                  size="small"
                  onClick={() => onQuickPresetChange("month")}
                >
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
              moment(
                filters["date[start]"] || defaultFilters["date[start]"],
                dateTimeFormat
              ),
              moment(
                filters["date[end]"] || defaultFilters["date[end]"],
                dateTimeFormat
              ),
            ]}
            onChange={onDateFromChange}
          />
        </Space>

        <Space style={{ marginBottom: "16px" }}>
          <Text style={{ width: "100px", display: "block" }}>Groups</Text>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.name ?? "").includes(input)
            }
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
      </div>

      <br />

      {illuminationDurationLoading ? (
        <Spin tip="Loading...">
          <DualAxes {...config} />
        </Spin>
      ) : (
        <DualAxes {...config} />
      )}
    </>
  );
});
