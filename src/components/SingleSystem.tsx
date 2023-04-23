import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import systemsApi from "../data/systemsApi";
import { useStores } from "../use-stores";

import { CombineIlluminationDurationAndBatteryLevelPerDay } from "../components/charts/CombineIlluminationDurationAndBatteryLevelPerDay";
import { CombineIlluminationDurationAndBatteryLevelPerHour } from "../components/charts/CombineIlluminationDurationAndBatteryLevelPerHour";
import { Temperature } from "./charts/Temperature";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTowerBroadcast,
  faCarBattery,
  faBatteryFull,
  faPlug,
  faBatteryEmpty,
  faTemperatureHalf,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import { Layout, Tabs } from "antd";
import type { TabsProps } from "antd";

import moment from "moment";

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

const SingleSystem = observer(() => {
  let { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [systemTitle, setSystemTitle] = useState("");
  const [hardCodeSystem, setHardCodeSystem] = useState({});

  const getAdditionalInfoAboutSystem = async (): Promise<void> => {
    try {
      const systemData = await systemsApi.getSystemById(Number(id));

      setSystemTitle(systemData.name);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const getAnotherSystemData = async (): Promise<void> => {
    try {
      const hardCodeSystemData = await systemsApi.getAnotherSystem(id);

      setHardCodeSystem(hardCodeSystemData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAnotherSystemData();

    getAdditionalInfoAboutSystem();
  }, []);

  const temperaturePerDayParams = {
    detalization: "1d",
    ["date[start]"]: moment().add(-1, "month").format(dateTimeFormat),
    ["date[end]"]: moment(new Date()).format(dateTimeFormat),
    system: id,
  };

  const temperaturePerHourParams = {
    detalization: "1h",
    ["date[start]"]: moment().add(-1, "week").format(dateTimeFormat),
    ["date[end]"]: moment(new Date()).format(dateTimeFormat),
    system: id,
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Battery Level vs Operation Time (Per Day)",
      children: (
        <CombineIlluminationDurationAndBatteryLevelPerDay system={id} />
      ),
    },
    {
      key: "2",
      label: "Battery Level vs Operation Time (Weekly Per Hour)",
      children: (
        <CombineIlluminationDurationAndBatteryLevelPerHour system={id} />
      ),
    },
    {
      key: "3",
      label: "Temperature (Per Day)",
      children: <Temperature system={id} params={temperaturePerDayParams} />,
    },
    {
      key: "4",
      label: "Temperature (Weekly Per Hour)",
      children: <Temperature system={id} params={temperaturePerHourParams} />,
    },
  ];

  return (
    !isLoading && (
      <Layout style={{ padding: 20 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 40, fontWeight: "bold" }}>
            {systemTitle || ""}
          </h1>
          <div>Updated (loc. time): {hardCodeSystem?.last_update}</div>
        </div>

        <div style={{ marginBottom: 40, display: "flex" }}>
          <div style={{ marginRight: 40 }}>
            <FontAwesomeIcon
              icon={faTowerBroadcast}
              style={{ marginRight: 10 }}
            />{" "}
            Online Devices: {hardCodeSystem?.devices}%
          </div>
          {hardCodeSystem?.ps_battery <= 1200 && (
            <div>
              <div style={{ marginRight: 30 }}>
                <FontAwesomeIcon
                  icon={faCarBattery}
                  style={{ marginRight: 10 }}
                />{" "}
                Backup battery:{"  "}
                {hardCodeSystem.ps_battery >= 1025 &&
                hardCodeSystem.ps_battery <= 1200
                  ? "OK"
                  : "CRITICAL"}
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faPlug}
                  color={"red"}
                  style={{ marginRight: 14 }}
                />{" "}
                <span style={{ color: "red" }}>AC Power Fail</span>
              </div>
            </div>
          )}
          <div style={{ marginRight: 40 }}>
            <FontAwesomeIcon
              icon={faBatteryFull}
              style={{ marginRight: 10 }}
              color={
                hardCodeSystem?.battery < 30
                  ? "red"
                  : hardCodeSystem?.battery > 65
                  ? "green"
                  : "orange"
              }
            />{" "}
            Avg. Battery Level Devices: {hardCodeSystem?.battery}%
          </div>
          <div style={{ marginRight: 40 }}>
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              icon={faBatteryEmpty}
              color={
                hardCodeSystem?.batterydays < 60
                  ? "red"
                  : hardCodeSystem?.batterydays > 180
                  ? "green"
                  : "orange"
              }
            />{" "}
            Replace battery in {hardCodeSystem?.batterydays} days
          </div>
          <div style={{ marginRight: 40 }}>
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              icon={faTemperatureHalf}
              color={
                hardCodeSystem?.temperature < 65
                  ? "red"
                  : hardCodeSystem?.temperature > 75
                  ? "green"
                  : "orange"
              }
            />{" "}
            Avg. Temperature Devices: {hardCodeSystem?.temperature}C
          </div>
          {hardCodeSystem?.emergency !== 0 && (
            <div>
              {" "}
              <FontAwesomeIcon
                style={{ marginRight: 10 }}
                icon={faTriangleExclamation}
              />{" "}
              Emergency mode ON
            </div>
          )}
        </div>

        <Tabs defaultActiveKey="1" items={items} />
      </Layout>
    )
  );
});

export default SingleSystem;
