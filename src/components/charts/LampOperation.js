import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";

import { Typography } from "antd";

const { Title } = Typography;

export const LampOperation = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      "https://gw.alipayobjects.com/os/antfincdn/PC3daFYjNw/column-data.json"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  //data
  const config = {
    data: [
      {
        name: "1",
        date: "17.09.2022",
        time: "12:00",
      },
      {
        name: "1",
        date: "18.09.2022",
        time: "13:00",
      },
      {
        name: "1",
        date: "19.09.2022",
        time: "14:00",
      },
      {
        name: "3",
        date: "20.09.2022",
        time: "15:00",
      },
      {
        name: "3",
        date: "17.09.2022",
        time: "16:00",
      },
      {
        name: "3",
        date: "18.09.2022",
        time: "17:00",
      },
      {
        name: "10",
        date: "16.09.2022",
        time: "18:00",
      },
      {
        name: "10",
        date: "17.09.2022",
        time: "19:00",
      },
      {
        name: "10",
        date: "17.09.2022",
        time: "20:00",
      },
      {
        name: "30",
        date: "17.09.2022",
        time: "20:00",
      },
      {
        name: "30",
        date: "17.09.2022",
        time: "21:00",
      },
      {
        name: "30",
        date: "19.09.2022",
        time: "21:00",
      },
      {
        name: "100",
        date: "12.09.2022",
        time: "13:00",
      },
      {
        name: "100",
        date: "17.09.2022",
        time: "13:00",
      },
      {
        name: "100",
        date: "17.09.2022",
        time: "13:00",
      },
    ],
    xField: "date",
    yField: "time",
    seriesField: "name",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
  };

  return (
    <>
      <Title>LampOperation</Title>
      <Column {...config} />
    </>
  );
};
