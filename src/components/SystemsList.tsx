import React, { useEffect } from "react";
import { useStores } from "../use-stores";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
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

    asyncGetSystems();
    asyncGetMe();
    asyncGetLamps();
    asyncGetGroups();
  }, []);

  const handleOpenSystem = (id: string): void => {
    navigate(`/charts/dashboard/${id}`);
  };

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
          {systemsData?.map((system) => {
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
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis'
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
                    {system?.ps_battery <= 1250 && (
                      <div>
                        <div>
                          <FontAwesomeIcon
                            icon={faCarBattery}
                            style={{ marginRight: 10 }}
                          />{" "}
                          Backup battery:{"  "}
                          {system.ps_battery >= 1050 &&
                          system.ps_battery <= 1250
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
                          (system?.temperature <= 0 && system?.temperature >= 75)
                            ? "red"
                            : (system?.temperature >= 10 && system?.temperature <= 55)
                            ? "green"
                            : (system?.temperature > 0 && system?.temperature < 10) || (system?.temperature > 55 && system?.temperature < 75) 
                            ? "orange"
                            : "red"
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
                    {system?.last_update && (
                      <div style={{ marginTop: 16 }}>Updated: {system?.last_update}</div>
                    )}
                    {system?.illumination && (
                      <div>{system?.illumination}</div>
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
