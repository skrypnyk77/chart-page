import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import systemsApi from "../data/systemsApi";
import { useStores } from "../use-stores";

// import { CombineIlluminationDurationAndBatteryLevelPerDay } from "../components/charts/CombineIlluminationDurationAndBatteryLevelPerDay";
// import { CombineIlluminationDurationAndBatteryLevelPerHour } from "../components/charts/CombineIlluminationDurationAndBatteryLevelPerHour";
import { Temperature } from "./charts/Temperature";
import { OnlineDevices } from "./charts/OnlineDevices";
import { Test } from "../components/charts/Test";
import { ModesHistory } from "../components/charts/ModesHistory";
import { NotificationsHistory } from "../components/charts/NotificationsHistory";
import { ExportHistory } from "../components/charts/ExportHistory";
import { RenameGroups } from "../components/charts/RenameGroups";

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

import { Button, Layout, Tabs, Input, Space } from "antd";
import type { TabsProps } from "antd";

import moment from "moment";

import "./index.css";

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

const SingleSystem = observer(() => {
  let { id } = useParams();
  const {
    userStore: { isAdmin },
  } = useStores();

  const [isLoading, setIsLoading] = useState(true);
  const [systemTitle, setSystemTitle] = useState("");
  const [showTitleInput, setShowTitleInput] = useState(false);
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

  const customPerDayParams = {
    detalization: "1d",
    ["date[start]"]: moment()
      .utcOffset(2)
      .add(-1, "month")
      .format(dateTimeFormat),
    ["date[end]"]: moment(new Date()).utcOffset(2).format(dateTimeFormat),
    system: id,
  };

  const customPerHourParams = {
    detalization: "1h",
    ["date[start]"]: moment()
      .utcOffset(2)
      .add(-1, "week")
      .format(dateTimeFormat),
    ["date[end]"]: moment(new Date()).utcOffset(2).format(dateTimeFormat),
    system: id,
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Battery vs Illum. (d)",
      children: <Test params={customPerDayParams} />,
    },
    {
      key: "2",
      label: "Battery vs Illum. (h)",
      children: <Test params={customPerHourParams} />,
    },
    {
      key: "3",
      label: "Temperature (d)",
      children: <Temperature params={customPerDayParams} />,
    },
    {
      key: "4",
      label: "Temperature (h)",
      children: <Temperature params={customPerHourParams} />,
    },
    {
      key: "5",
      label: "Online (d)",
      children: <OnlineDevices params={customPerDayParams} />,
    },
    {
      key: "6",
      label: "Online (h)",
      children: <OnlineDevices params={customPerHourParams} />,
    },
    // {
    //   key: "7",
    //   label: "Battery vs Illum. (d)",
    //   children: (
    //     <CombineIlluminationDurationAndBatteryLevelPerDay
    //       params={customPerDayParams}
    //     />
    //   ),
    // },
    // {
    //   key: "8",
    //   label: "Battery vs Illum. (h)",
    //   children: (
    //     <CombineIlluminationDurationAndBatteryLevelPerHour
    //       params={customPerHourParams}
    //     />
    //   ),
    // },
    {
      key: "7",
      label: "Modes history",
      children: <ModesHistory system={id} />,
    },
    {
      key: "8",
      label: "Notifications",
      children: <NotificationsHistory system={id} />,
    },
    {
      key: "9",
      label: "Export",
      children: <ExportHistory system={id} />,
    },
    {
      key: "10",
      label: "Rename Groups",
      children: <RenameGroups system={id} />,
    },
  ];

  const handleChangeSystemTitle = (e) => {
    setSystemTitle(e.target.value);
  };

  const updateSystemTitle = async (): Promise<void> => {
    try {
      await systemsApi.updateSystem({ system: id, name: systemTitle });

      setShowTitleInput(false);

      getAnotherSystemData();

      getAdditionalInfoAboutSystem();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    !isLoading && (
      <Layout style={{ padding: 20 }}>
        <div style={{ marginBottom: 30 }}>
          {showTitleInput && isAdmin ? (
            <Space.Compact
              size="large"
              style={{
                width: 600,
                marginBottom: 40,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Space>
                <Input
                  status={systemTitle ? "" : "error"}
                  style={{ width: 400 }}
                  value={systemTitle || ""}
                  onChange={handleChangeSystemTitle}
                />
                <Button
                  disabled={!systemTitle}
                  onClick={updateSystemTitle}
                  type="primary"
                >
                  Update
                </Button>
              </Space>
              {!systemTitle && (
                <div style={{ color: "#ff4d4f" }}>
                  System name must not be empty
                </div>
              )}
            </Space.Compact>
          ) : (
            <h1
              onClick={() => setShowTitleInput(true)}
              style={{
                fontSize: 40,
                fontWeight: "bold",
                cursor: isAdmin ? "pointer" : "text",
              }}
            >
              {systemTitle || ""}
            </h1>
          )}
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
          {hardCodeSystem?.ps_battery <= 1250 && (
            <div>
              <div style={{ marginRight: 30 }}>
                <FontAwesomeIcon
                  icon={faCarBattery}
                  style={{ marginRight: 10 }}
                />{" "}
                Backup battery:{"  "}
                {hardCodeSystem.ps_battery >= 1050 &&
                hardCodeSystem.ps_battery <= 1250
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
                hardCodeSystem?.temperature <= 0 &&
                hardCodeSystem?.temperature >= 75
                  ? "red"
                  : hardCodeSystem?.temperature >= 10 &&
                    hardCodeSystem?.temperature <= 55
                  ? "green"
                  : (hardCodeSystem?.temperature > 0 &&
                      hardCodeSystem?.temperature < 10) ||
                    (hardCodeSystem?.temperature > 55 &&
                      hardCodeSystem?.temperature < 75)
                  ? "orange"
                  : "red"
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
