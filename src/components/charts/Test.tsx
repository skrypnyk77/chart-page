import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import batteryApi from "../../data/batteryApi";
import illuminationApi from "../../data/illuminationApi";

import { Typography, Spin } from "antd";
import moment from "moment";

import { DualAxes } from "@ant-design/plots";

const { Title } = Typography;

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

export const Test = observer(({ params }) => {
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
        const batteryLevel = await batteryApi.getPhpBatteryLevelGroup({
          ...params,
        });

        setBatteryLevel(batteryLevel);

        const illuminationDuration =
          await illuminationApi.getPhpIlluminationGroup({
            ...params,
          });

        setIlluminationDuration(illuminationDuration);
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
    yField: ["duration", "battery"],
    geometryOptions: [
      {
        geometry: "column",
        isGroup: true,
        seriesField: "name",
        columnWidthRatio: 0.4,
      },
      {
        geometry: "line",
        seriesField: "name",
      },
    ],
    xAxis: {
      label: {
        formatter: (text: string, item: any, index: number) => {
          if (params.detalization === "1d") {
            return text;
          } else {
            const el = item.name.split(" ");

            if (el[1] === "00:00") {
              return el[0] + " " + el[1];
            } else {
              return el[1];
            }
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
      duration: {
        title: {
          text:
            params.detalization === "1d"
              ? "Duration in hours"
              : "Duration in minutes",
          style: {
            fontSize: 16,
          },
        },
      },
      battery: {
        title: {
          text: "Battery level in %",
          style: {
            fontSize: 16,
          },
        },
      },
    },
  };

  return (
    <>
      <Title style={{ marginBottom: "24px" }}>{params.detalization === '1d' ? 'Battery Level vs Operation Time (Per Day)' : 'Battery Level vs Operation Time (Weekly Per Hour)' }</Title>
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
});