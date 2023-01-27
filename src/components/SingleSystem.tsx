import React from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";

import { BatteryLevel } from "../components/charts/BatteryLevel";
import { Temperature } from "../components/charts/Temperature";

import { Layout } from "antd";

const SingleSystem = observer(() => {
  let { id } = useParams();

  return (
    <Layout style={{ padding: 20 }}>
      <BatteryLevel system={id} />
      <br />
      <br />
      <Temperature system={id} />
    </Layout>
  );
});

export default SingleSystem;
