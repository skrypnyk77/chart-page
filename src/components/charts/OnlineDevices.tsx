import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import temperatureApi from "../../data/temperatureApi";

import { Column } from "@ant-design/plots";
import { Typography, Spin } from "antd";

const { Title } = Typography;

export const OnlineDevices = observer(({ params }) => {
  const [temperatureLoading, setTemperatureLoading] = useState(false);

  const [onlineDevices, setOnlineDevices] = useState([]);

  const asyncGetOnlineDevices = async (): Promise<void> => {
    setTemperatureLoading(true);

    try {
      const data = await temperatureApi.getPhpOnlineDevices({
        ...params,
      });

      setOnlineDevices(data);
    } catch (err) {
      console.log(err);
    }

    setTemperatureLoading(false);
  };

  useEffect(() => {
    asyncGetOnlineDevices();
  }, []);

  const config = {
    data: onlineDevices,
    xField: "date",
    yField: "value",
    columnWidthRatio: 0.8,
    label: params.detalization === '1d' && {
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0.6,
        fontSize: 12,
      },
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
          fontSize: params.detalization === '1d' ? 12 : 8,
          textAlign: "right",
          textBaseline: "middle",
        },
        rotate: 11,
        autoRotate: true,
        autoHide: false,
        autoEllipsis: false,
      },
      tickCount: onlineDevices.length,
    },
  };

  return (
    <>
      <Title style={{ marginBottom: "24px" }}>Online Devices</Title>

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
