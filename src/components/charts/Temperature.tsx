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
          fontSize: params.detalization === "1d" ? 12 : 8,
          textAlign: "right",
          textBaseline: "middle",
        },
        rotate: 11,
        autoRotate: true,
        autoHide: false,
        autoEllipsis: false,
      },
      tickCount: temperature.length,
    },
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
