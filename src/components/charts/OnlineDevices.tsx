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
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
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
