import React, { useEffect, useState } from "react";
import { useStores } from "../use-stores";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import systemsApi from "../data/systemsApi";

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

import { Card, Layout, Typography, Row, Col, Spin } from "antd";

const { Title } = Typography;

const SystemsList = observer(() => {
  const navigate = useNavigate();

  const {
    userStore: { getMe },
    groupsStore: { getGroups },
    lampsStore: { getLamps },
    systemsStore: { getSystems, systemsData, isLoading },
  } = useStores();

  const [combineData, setCombineData] = useState([]);

  useEffect(() => {
    async function asyncGetHardCodeSystem() {
      try {
        const data = await Promise.all(
          systemsData.map((item, index) =>
            systemsApi.getAnotherSystem(index + 1)
          )
        );

        const mapped = systemsData.map((item, index) => {
          return {
            ...item,
            battery: data[index]?.battery,
            batterydays: data[index]?.batterydays,
            devices: data[index]?.devices,
            emergency: data[index]?.emergency,
            ps_battery: data[index]?.ps_battery,
            temperature: data[index]?.temperature,
          };
        });

        setCombineData(mapped);
      } catch (error) {
        console.log(error);
      }
    }

    async function asyncGetMe() {
      await getMe();
    }
    async function asyncGetLamps() {
      await getLamps();
    }

    async function asyncGetGroups() {
      await getGroups();
    }

    async function asyncGetSystems() {
      await getSystems();
    }

    asyncGetHardCodeSystem();
    asyncGetMe();
    asyncGetLamps();
    asyncGetGroups();
    asyncGetSystems();
  }, []);

  const handleOpenSystem = (id: string): void => {
    navigate(`/charts/dashboard/${id}`);
  };

  console.log("combineData", combineData);

  return (
    <Layout style={{ padding: 20 }}>
      <Title style={{ marginBottom: "24px" }} level={2}>
        Systems
      </Title>

      {isLoading ? (
        <div
          style={{
            margin: "350px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Row>
          {combineData?.map((system) => {
            return (
              <Col style={{ display: "inline-grid" }} key={system.id} span={6}>
                <Card
                  onClick={() => handleOpenSystem(system.id)}
                  hoverable
                  title={system.name}
                  bordered={false}
                  style={{
                    marginBottom: 20,
                    marginRight: 12,
                    minHeight: 210,
                    fontSize: 13,
                  }}
                >
                  <div>
                    <div>
                      <FontAwesomeIcon
                        icon={faTowerBroadcast}
                        style={{ marginRight: 8 }}
                      />{" "}
                      Online Devices: {system?.devices}%
                    </div>
                    {system?.ps_battery <= 1200 && (
                      <div>
                        <div>
                          <FontAwesomeIcon
                            icon={faCarBattery}
                            style={{ marginRight: 10 }}
                          />{" "}
                          Backup battery:{"  "}
                          {system.ps_battery >= 1025 &&
                          system.ps_battery <= 1200
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
                    <div>
                      <FontAwesomeIcon
                        icon={faBatteryFull}
                        style={{ marginRight: 10 }}
                        color={
                          system?.battery < 30
                            ? "red"
                            : system?.battery > 65
                            ? "green"
                            : "orange"
                        }
                      />{" "}
                      Avg. Battery Level Devices: {system?.battery}%
                    </div>
                    <div>
                      <FontAwesomeIcon
                        style={{ marginRight: 10 }}
                        icon={faBatteryEmpty}
                        color={
                          system?.batterydays < 60
                            ? "red"
                            : system?.batterydays > 180
                            ? "green"
                            : "orange"
                        }
                      />{" "}
                      Replace battery in {system?.batterydays} days
                    </div>
                    <div>
                      <FontAwesomeIcon
                        style={{ marginRight: 17 }}
                        icon={faTemperatureHalf}
                        color={
                          system?.temperature < 65
                            ? "red"
                            : system?.temperature > 75
                            ? "green"
                            : "orange"
                        }
                      />{" "}
                      Avg. Temperature Devices: {system?.temperature}C
                    </div>
                    {system?.emergency !== 0 && (
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
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Layout>
  );
});

export default SystemsList;
