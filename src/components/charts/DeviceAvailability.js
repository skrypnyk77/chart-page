import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";

import { Typography } from 'antd';

const { Title } = Typography;

export const DeviceAvailability = () => {
  const data = [
    {
      date: "11.09.2022",
      value: 38,
    },
    {
      date: "12.09.2022",
      value: 52,
    },
    {
      date: "13.09.2022",
      value: 61,
    },
    {
      date: "14.09.2022",
      value: 145,
    },
    {
      date: "15.09.2022",
      value: 48,
    },
  ];

  const config = {
    data,
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
      <Title>DeviceAvailability</Title>
      <Column {...config} />
    </>
  );
};
