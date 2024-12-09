import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import temperatureApi from "../../data/temperatureApi";

import { Column } from "@ant-design/plots";
import { Typography, Spin, DatePicker } from "antd";

import moment from "moment";

import type { DatePickerProps } from "antd";

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const dateFormat = "YYYY-MM-DD";

const { Title } = Typography;

export const Temperature = observer(({ params }) => {
  const [temperatureLoading, setTemperatureLoading] = useState(false);

  const [temperature, setTemperature] = useState([]);

  const asyncGetTemperature = async (): Promise<void> => {
    setTemperatureLoading(true);

    try {
      const data = await temperatureApi.getPhpTemperature({
        ...params,
      });

      setTemperature(data);
    } catch (err) {
      console.log(err);
    }

    setTemperatureLoading(false);
  };

  useEffect(() => {
    asyncGetTemperature();
  }, []);

  const config = {
    data: temperature,
    xField: "date",
    yField: "temperature",
    columnWidthRatio: 0.8,
    label: params.detalization === "1d" && {
      style: {
        fill: "#000000",
        opacity: 0.6,
        fontSize: 12,
      },
      position: "top",
    },
    xAxis: {
      fontSize: 20,
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
      tickCount: temperature.length,
      title: {
        text: params.detalization === "1d" ? "Date" : "Datetime",
        position: "start",
        style: {
          fontSize: 16,
        },
      },
    },
    annotations: [
      {
        type: "html",
        position: ["-9%", "50%"],
        html: `
          <div style="display: flex; align-items: center; font-size: 15px;  color: rgb(89, 89, 89); transform: rotate(-90deg);">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="temperature-half" class="svg-inline--fa fa-temperature-half" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" color="rgb(89, 89, 89)" style="margin-right: 10px;"><path fill="currentColor" d="M160 64c-26.5 0-48 21.5-48 48V276.5c0 17.3-7.1 31.9-15.3 42.5C86.2 332.6 80 349.5 80 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5V112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.1 0 160 0s112 50.1 112 112V276.5c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S16 447.5 16 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6V112zM208 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3V208c0-8.8 7.2-16 16-16s16 7.2 16 16V322.7c18.6 6.6 32 24.4 32 45.3z"></path></svg>
            <span>Temperature, °C</span>
          </div>`,
      },
    ],
    padding: "auto", //
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

    await asyncGetTemperature();
  };

  return (
    <>
      <Title style={{ marginBottom: "24px" }}>Temperature</Title>
      <DatePicker
        onChange={onChange}
        defaultValue={moment(new Date(), dateTimeFormat).utcOffset(2)}
      />
      <br />
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
