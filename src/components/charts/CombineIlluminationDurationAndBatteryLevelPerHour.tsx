import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import batteryApi from "../../data/batteryApi";
import illuminationApi from "../../data/illuminationApi";

import { Typography, Spin, DatePicker } from "antd";
import moment from "moment";
import type { DatePickerProps } from "antd";

import { DualAxes } from "@ant-design/plots";

const { Title } = Typography;

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const dateFormat = "YYYY-MM-DD";

export const CombineIlluminationDurationAndBatteryLevelPerHour = observer(
  ({ params }) => {
    const [
      combineDurationAndBatteryLoading,
      setCombineDurationAndBatteryLoading,
    ] = useState(false);

    const [illuminationDuration, setIlluminationDuration] = useState([]);
    const [batteryLevel, setBatteryLevel] = useState([]);

    const asyncGetCombineIlluminationDurationAndBetteryLevel =
      async (): Promise<void> => {
        setCombineDurationAndBatteryLoading(true);

        try {
          const batteryLevel = await batteryApi.getPhpBatteryLevel({
            ...params,
          });

          setBatteryLevel(batteryLevel);

          const illuminationDuration = await illuminationApi.getPhpIllumination(
            {
              ...params,
            }
          );

          const minutesMapped = illuminationDuration.map((item) => {
            return {
              date: item.date,
              minutes: item.minutes,
              name: "minutes",
            };
          });

          setIlluminationDuration([...minutesMapped]);
        } catch (err) {
          console.log(err);
        }

        setCombineDurationAndBatteryLoading(false);
      };

    useEffect(() => {
      asyncGetCombineIlluminationDurationAndBetteryLevel();
    }, []);

    const config = {
      data: [illuminationDuration, batteryLevel],
      xField: "date",
      yField: ["minutes", "batteryLevel"],
      geometryOptions: [
        {
          geometry: "column",
          columnWidthRatio: 0.7,
          label: {},
          color: "#1890ff",
        },
        {
          geometry: "line",
          color: "#ee7600",
          seriesField: "batteryLevel",
          lineStyle: {
            lineWidth: 3,
          },
        },
      ],
      xAxis: {
        label: {
          formatter: (text: string, item: any, index: number) => {
            const el = item.name.split(" ");

            if (el[1] === "00:00") {
              return el[0] + " " + el[1];
            } else {
              return el[1];
            }
          },
          style: {
            fontSize: 8,
            textAlign: "right",
            textBaseline: "middle",
          },
          rotate: 11,
          autoRotate: true,
          autoHide: false,
          autoEllipsis: false,
        },
        tickCount: illuminationDuration.length,
      },
      yAxis: {
        minutes: {
          title: {
            text: "Time in minutes",
            style: {
              fontSize: 16,
            },
          },
        },
        batteryLevel: {
          title: {
            text: "Battery level in %",
            style: {
              fontSize: 16,
            },
          },
        },
      },
    };

    const onChange: DatePickerProps["onChange"] = async (date) => {
      if (date) {
        params["date[end]"] = moment(date).format(dateTimeFormat);

        const selectedDate = moment(params["date[end]"])
          .utcOffset(2)
          .format(dateFormat);
        const nowDate = moment(new Date()).utcOffset(2).format(dateFormat);

        const isSameOrAfter = moment(selectedDate).isSameOrAfter(
          nowDate,
          "day"
        );

        if (!isSameOrAfter) {
          params["date[end]"] = moment(params["date[end]"])
            .endOf("day")
            .format(dateTimeFormat);
        }
      } else {
        params["date[end]"] = moment(new Date())
          .utcOffset(2)
          .format(dateTimeFormat);
      }

      if (params.detalization === "1d") {
        params["date[start]"] = moment(params["date[end]"])
          .add(-1, "month")
          .format(dateTimeFormat);
      } else {
        params["date[start]"] = moment(params["date[end]"])
          .add(-1, "week")
          .format(dateTimeFormat);
      }

      await asyncGetCombineIlluminationDurationAndBetteryLevel();
    };

    return (
      <>
        <Title style={{ marginBottom: "24px" }}>
          Battery Level vs Operation Time (Weekly Per Hour)
        </Title>
        <DatePicker
          onChange={onChange}
          defaultValue={moment(new Date(), dateTimeFormat).utcOffset(2)}
        />
        <br />
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
  }
);
