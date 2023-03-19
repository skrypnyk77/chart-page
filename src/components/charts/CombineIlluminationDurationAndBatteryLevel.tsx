import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";

import batteryApi from "../../data/batteryApi";
import illuminationApi from "../../data/illuminationApi";
import { useStores } from "../../use-stores";

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

import { DualAxes } from "@ant-design/plots";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

export const CombineIlluminationDurationAndBatteryLevel = observer(
  ({ system, params }) => {
    const {
      groupsStore: { groupsData },
      lampsStore: { lampsData },
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

    const defaultIlluminationDurationFilters = {
      detalization: "1h",
      mode: "total",
      ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
      ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      system: system,
      group: params.group,
    };

    const defaultBatteryLevelFilters = {
      detalization: "1h",
      ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
      ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      system: system,
      group: params.group,
    };

    const [
      combineDurationAndBatteryLoading,
      setCombineDurationAndBatteryLoading,
    ] = useState(false);

    const [illuminationDuration, setIlluminationDuration] = useState([]);
    const [batteryLevel, setBatteryLevel] = useState([]);
    const [filters, setFilters] = useState({});

    const asyncGetCombineIlluminationDurationAndBetteryLevel =
      async (): Promise<void> => {
        setCombineDurationAndBatteryLoading(true);

        try {
          const batteryLevel = await batteryApi.getBatteryLevel({
            ...defaultBatteryLevelFilters,
          });

          setBatteryLevel(batteryLevel);

          const illuminationDuration =
            await illuminationApi.getIlluminationDuration({
              ...defaultIlluminationDurationFilters,
            });

          const hoursMapped = illuminationDuration.map((item) => {
            return { date: item.date, count: item.hours, name: "hours" };
          });

          const minutesMapped = illuminationDuration.map((item) => {
            return { date: item.date, count: item.minutes, name: "minutes" };
          });

          setIlluminationDuration([...hoursMapped, ...minutesMapped]);
        } catch (err) {
          console.log(err);
        }

        setCombineDurationAndBatteryLoading(false);
      };

    useEffect(() => {
      asyncGetCombineIlluminationDurationAndBetteryLevel();
    }, []);

    const uvBillData = [
      {
        time: "2019-03",
        value: 350,
        type: "uv",
      },
      {
        time: "2019-04",
        value: 900,
        type: "uv",
      },
      {
        time: "2019-05",
        value: 300,
        type: "uv",
      },
      {
        time: "2019-06",
        value: 450,
        type: "uv",
      },
      {
        time: "2019-07",
        value: 470,
        type: "uv",
      },
      {
        time: "2019-03",
        value: 220,
        type: "bill",
      },
      {
        time: "2019-04",
        value: 300,
        type: "bill",
      },
      {
        time: "2019-05",
        value: 250,
        type: "bill",
      },
      {
        time: "2019-06",
        value: 220,
        type: "bill",
      },
      {
        time: "2019-07",
        value: 362,
        type: "bill",
      },
    ];

    const transformData = [
      {
        time: "2019-03",
        count: 800,
      },
      {
        time: "2019-04",
        count: 600,
      },
      {
        time: "2019-05",
        count: 400,
      },
      {
        time: "2019-06",
        count: 380,
      },
      {
        time: "2019-07",
        count: 220,
      },
    ];

    const config = {
      data: [batteryLevel, illuminationDuration],
      xField: "date",
      yField: ["batteryLevel", "count"],
      geometryOptions: [
        {
          geometry: "column",
          columnWidthRatio: 0.4,
        },
        {
          geometry: "line",
          seriesField: "name",
        },
      ],
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

    //submit filters
    const submitFilters = async (): Promise<void> => {
      setCombineDurationAndBatteryLoading(true);

      try {
        // const data = await temperatureApi.getTemperature({
        //   ...filters,
        // });
        // setTemperature(data);
      } catch (error) {
        console.log(error);
      }

      setCombineDurationAndBatteryLoading(false);
    };

    //reset filters
    const resetFilters = async (): Promise<void> => {
      //   await asyncGetTemperature();
    };

    return (
      <>
        <Title style={{ marginBottom: "24px" }}>
          Combine Illumination Duration and Battery Level
        </Title>
        {/* <Space style={{ marginBottom: "16px" }}>
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
        <Space style={{ marginBottom: "16px" }}>
          <Text style={{ width: "100px", display: "block" }}>Lamps</Text>
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
        </Space> */}
        <br />
        {combineDurationAndBatteryLoading ? (
          <Spin tip="Loading...">
            <DualAxes {...config} />
          </Spin>
        ) : (
          <DualAxes {...config} />
        )}
      </>
    );

    return;
  }
);
