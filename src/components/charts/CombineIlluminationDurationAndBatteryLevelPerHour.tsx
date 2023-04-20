import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import batteryApi from "../../data/batteryApi";
import illuminationApi from "../../data/illuminationApi";

import { Typography, Spin } from "antd";
import moment from "moment";

import { DualAxes } from "@ant-design/plots";

const { Title } = Typography;

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

export const CombineIlluminationDurationAndBatteryLevelPerHour = observer(
  ({ system }) => {
    const defaultIlluminationDurationWeekFilters = {
      detalization: "1h",
      ["date[start]"]: moment().add(-1, "week").format(dateTimeFormat),
      ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      system: system,
    };

    const defaultBatteryLevelWeekFilters = {
      detalization: "1h",
      ["date[start]"]: moment().add(-1, "week").format(dateTimeFormat),
      ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      system: system,
    };

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
          const batteryLevel = await batteryApi.getBatteryLevel({
            ...defaultBatteryLevelWeekFilters,
          });

          setBatteryLevel(batteryLevel);

          const illuminationDuration = await illuminationApi.getPhpIllumination(
            {
              ...defaultIlluminationDurationWeekFilters,
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
      legend: {
        custom: true,
        position: "bottom",
        items: [
          {
            value: "batteryLevel",
            name: "Average Battery Level (%)",
            marker: {
              symbol: "square",
              style: {
                fill: "#ee7600",
                r: 5,
              },
            },
          },
          {
            value: "minutes",
            name: "Light Operations (minutes)",
            marker: {
              symbol: "square",
              style: {
                fill: "#1890ff",
                r: 5,
              },
            },
          },
        ],
      },
    };

    return (
      <>
        <Title style={{ marginBottom: "24px" }}>
          Battery Level vs Operation Time (Weekly Per Hour)
        </Title>
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
