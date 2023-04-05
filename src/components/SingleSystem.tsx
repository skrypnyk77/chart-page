import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import systemsApi from "../data/systemsApi";

import { CombineIlluminationDurationAndBatteryLevelPerDay } from "../components/charts/CombineIlluminationDurationAndBatteryLevelPerDay";
import { CombineIlluminationDurationAndBatteryLevelPerHour } from "../components/charts/CombineIlluminationDurationAndBatteryLevelPerHour";
import { IlluminationDuration } from "../components/charts/IlluminationDuration";
import { BatteryLevel } from "../components/charts/BatteryLevel";
import { Temperature } from "../components/charts/Temperature";

import { Layout } from "antd";

const SingleSystem = observer(() => {
  let { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [systemTitle, setSystemTitle] = useState("");
  const [params, setParams] = useState({});

  const getAdditionalInfoAboutSystem = async (): Promise<void> => {
    try {
      const systemData = await systemsApi.getSystemById(Number(id));

      setSystemTitle(systemData.name);

      let lampIds = [];
      let groupIds = [];

      if (systemData.lamps) {
        systemData.lamps.forEach((item: any) => {
          lampIds.push(item.id);
        });
      }

      if (systemData.groups_info) {
        systemData.groups_info.forEach((item: any) => {
          groupIds.push(item.group.id);
        });
      }

      setParams({ lamp: lampIds, group: groupIds });
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getAdditionalInfoAboutSystem();
  }, []);

  return (
    !isLoading && (
      <Layout style={{ padding: 20 }}>
        <h1 style={{ fontSize: 40, fontWeight: "bold", paddingBottom: 50 }}>
          {systemTitle || ""}
        </h1>
        <CombineIlluminationDurationAndBatteryLevelPerDay system={id} />
        <br />
        <br />
        <CombineIlluminationDurationAndBatteryLevelPerHour system={id} />
        <br />
        <br />
        <IlluminationDuration system={id} params={params} />
        <br />
        <br />
        <BatteryLevel system={id} params={params} />
        <br />
        <br />
        <Temperature system={id} params={params} />
      </Layout>
    )
  );
});

export default SingleSystem;
