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

          const illuminationDuration =
            await illuminationApi.getIlluminationDuration({
              ...defaultIlluminationDurationWeekFilters,
            });

          const minutesMapped = illuminationDuration.map((item) => {
            return { date: item.date, minutes: item.minutes, name: "minutes" };
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
          color: ["#5B8FF9", "#5D7092"],
        },
        {
          geometry: "line",
          color: "#29cae4",
          seriesField: "batteryLevel",
        },
      ],
      xAxis: {
        label: {
          style: {
            fontSize: 8,
            textAlign: 'right',
            textBaseline: 'middle',
          },
          rotate: 11,
          autoRotate: true,
          autoHide: false,
          autoEllipsis: false,
        },
        tickCount: illuminationDuration.length,
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
                fill: "#29cae4",
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
                fill: "#586bce",
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
          Biggin Hill / Battery Level vs Operation Time (Weekly Per Hour)
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
