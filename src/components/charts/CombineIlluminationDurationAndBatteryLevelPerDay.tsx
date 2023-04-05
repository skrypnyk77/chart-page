import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import batteryApi from "../../data/batteryApi";
import illuminationApi from "../../data/illuminationApi";

import { Typography, Spin } from "antd";
import moment from "moment";

import { DualAxes } from "@ant-design/plots";

const { Title } = Typography;

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

export const CombineIlluminationDurationAndBatteryLevelPerDay = observer(
  ({ system }) => {
    const defaultIlluminationDurationWeekFilters = {
      detalization: "1d",
      ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
      ["date[end]"]: moment(new Date()).format(dateTimeFormat),
      system: system,
    };

    const defaultBatteryLevelWeekFilters = {
      detalization: "1d",
      ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
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

          const hoursMapped = illuminationDuration.map((item) => {
            return { date: item.date, hours: item.hours, name: "hours" };
          });

          setIlluminationDuration([...hoursMapped]);
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
      yField: ["hours", "batteryLevel"],
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
        fontSize: 20,
        label: {
          style: {
            fontSize: 12,
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
            value: "hours",
            name: "Light Operations (hours)",
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
          Battery Level vs Operation Time (Per Day)
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
