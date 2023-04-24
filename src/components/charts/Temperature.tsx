import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import temperatureApi from "../../data/temperatureApi";

import { Column } from "@ant-design/plots";
import { Typography, Spin } from "antd";

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
    label: {
      style: {
        fill: '#000000',
        opacity: 0.6,
        fontSize: 12,
      },
      position: 'top',
      offset: 10,
    },
    xAxis: {
      fontSize: 20,
      label: {
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
      tickCount: temperature.length
    },
  };

  return (
    <>
      <Title style={{ marginBottom: "24px" }}>Temperature</Title>

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
