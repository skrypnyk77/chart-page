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

  const [system4, setSystem4] = useState({});
  const [system20, setSystem20] = useState({});

  useEffect(() => {
    async function asyncGetHardCodeSystem() {
      const systemData4 = await systemsApi.getAnotherSystem("4");
      setSystem4(systemData4);

      const systemData20 = await systemsApi.getAnotherSystem("20");
      setSystem20(systemData20);
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
                  }}
                >
                  {system.id === 4 ? (
                    <div>
                      <div>
                        <FontAwesomeIcon
                          icon={faTowerBroadcast}
                          style={{ marginRight: 8 }}
                        />{" "}
                        Online Devices: {system4?.devices}%
                      </div>
                      {system4?.ps_battery <= 1200 && (
                        <div>
                          <div>
                            <FontAwesomeIcon
                              icon={faCarBattery}
                              style={{ marginRight: 10 }}
                            />{" "}
                            Backup battery:{"  "}
                            {system4.ps_battery >= 1025 &&
                            system4.ps_battery <= 1200
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
                            system4?.battery < 30
                              ? "red"
                              : system4?.battery > 65
                              ? "green"
                              : "orange"
                          }
                        />{" "}
                        Avg. Battery Level Devices: {system4?.battery}%
                      </div>
                      <div>
                        <FontAwesomeIcon
                          style={{ marginRight: 10 }}
                          icon={faBatteryEmpty}
                          color={
                            system4?.batterydays < 60
                              ? "red"
                              : system4?.batterydays > 180
                              ? "green"
                              : "orange"
                          }
                        />{" "}
                        Replace battery in {system4?.batterydays} days
                      </div>
                      <div>
                        <FontAwesomeIcon
                          style={{ marginRight: 17 }}
                          icon={faTemperatureHalf}
                          color={
                            system4?.temperature < 65
                              ? "red"
                              : system4?.temperature > 75
                              ? "green"
                              : "orange"
                          }
                        />{" "}
                        Avg. Temperature Devices: {system4?.temperature}C
                      </div>
                      {system4?.emergency !== 0 && (
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
                  ) : system.id === 20 ? (
                    <div>
                      <div>
                        <FontAwesomeIcon
                          icon={faTowerBroadcast}
                          style={{ marginRight: 8 }}
                        />{" "}
                        Online Devices: {system20?.devices}%
                      </div>
                      {system20?.ps_battery <= 1200 && (
                        <div>
                          <div>
                            <FontAwesomeIcon
                              icon={faCarBattery}
                              style={{ marginRight: 10 }}
                            />{" "}
                            Backup battery:{"  "}
                            {system20.ps_battery >= 1025 &&
                            system20.ps_battery <= 1200
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
                            system20?.battery < 30
                              ? "red"
                              : system20?.battery > 65
                              ? "green"
                              : "orange"
                          }
                        />{" "}
                        Avg. Battery Level Devices: {system20?.battery}%
                      </div>
                      <div>
                        <FontAwesomeIcon
                          style={{ marginRight: 10 }}
                          icon={faBatteryEmpty}
                          color={
                            system20?.batterydays < 60
                              ? "red"
                              : system20?.batterydays > 180
                              ? "green"
                              : "orange"
                          }
                        />{" "}
                        Replace battery in {system20?.batterydays} days
                      </div>
                      <div>
                        <FontAwesomeIcon
                          style={{ marginRight: 17 }}
                          icon={faTemperatureHalf}
                          color={
                            system20?.temperature < 65
                              ? "red"
                              : system20?.temperature > 75
                              ? "green"
                              : "orange"
                          }
                        />{" "}
                        Avg. Temperature Devices: {system20?.temperature}C
                      </div>
                      {system20?.emergency !== 0 && (
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
                  ) : (
                    <div>
                      {/* <div>Online: {system.available_devices}%</div>
                      <div>
                        Backup battery:{"  "}
                        {system.available_devices < 1025
                          ? "Critical"
                          : system.available_devices > 1025 &&
                            system.available_devices < 1200}
                      </div>
                      <div>Battery XX %</div>
                      <div>Replcace battery in XXX days</div>
                      <div>Temperature XX C</div>
                      {system.emergency_mode && (
                        <div>
                          {"  "}
                          Emergency mode ON
                        </div>
                      )} */}
                    </div>
                  )}
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
