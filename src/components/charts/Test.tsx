import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import batteryApi from "../../data/batteryApi";
import illuminationApi from "../../data/illuminationApi";

import { Typography, Spin, DatePicker } from "antd";
import moment from "moment";

import { DualAxes } from "@ant-design/plots";

import type { DatePickerProps } from "antd";

const { Title } = Typography;

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const dateFormat = "YYYY-MM-DD";

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
          fontSize: params.detalization === "1d" ? 14 : 8,
          textAlign: "right",
          textBaseline: "middle",
        },
        rotate: 11,
        autoRotate: true,
        autoHide: false,
        autoEllipsis: false,
      },
      tickCount: illuminationDuration.length,
      title: {
        text: params.detalization === "1d" ? "Date" : "Datetime",
        position: "start",
        style: {
          fontSize: 15,
        },
      },
    },
    meta: {
      battery: {
        min: 0,
        max: 100,
      },
    },
    yAxis: {
      duration: {
        title: {
          text:
            params.detalization === "1d"
              ? "Duration in hours"
              : "Duration in minutes",
          style: {
            fontSize: 15,
          },
        },
      },
      battery: {
        title: {
          text: "",
          style: {
            fontSize: 15,
            color: "",
          },
        },
      },
    },
    annotations: {
      battery: [
        {
          type: "html",
          position: ["97%", "50%"],
          html: `
            <div style="display: flex; align-items: center; font-size: 15px; width: 150px;  color: rgb(89, 89, 89); transform: rotate(-90deg);">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="battery-full" class="svg-inline--fa fa-battery-full " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" color="rgb(89, 89, 89)" style="margin-right: 10px;"><path fill="currentColor" d="M464 160c8.8 0 16 7.2 16 16V336c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16H464zM80 96C35.8 96 0 131.8 0 176V336c0 44.2 35.8 80 80 80H464c44.2 0 80-35.8 80-80V320c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32V176c0-44.2-35.8-80-80-80H80zm368 96H96V320H448V192z"></path></svg>
              <span>Battery level in %</span>
            </div>`,
        },
      ],
    },

    padding: "auto", // Ensure space for annotation
  };

  const onChange: DatePickerProps["onChange"] = async (date) => {
    if (date) {
      params["date[end]"] = moment(date).format(dateTimeFormat);

      const selectedDate = moment(params["date[end]"])
        .utcOffset(2)
        .format(dateFormat);
      const nowDate = moment(new Date()).utcOffset(2).format(dateFormat);

      const isSameOrAfter = moment(selectedDate).isSameOrAfter(nowDate, "day");

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
        {params.detalization === "1d"
          ? "Battery Level vs Operation Time (Per Day)"
          : "Battery Level vs Operation Time (Weekly Per Hour)"}
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
});
