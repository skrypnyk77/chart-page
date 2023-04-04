import React, { useEffect } from "react";
import { useStores } from "../use-stores";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

import { Card, Layout, Typography, Row, Col, Spin } from "antd";

const { Title, Text } = Typography;

const SystemsList = observer(() => {
  const navigate = useNavigate();

  const {
    groupsStore: { getGroups },
    lampsStore: { getLamps },
    systemsStore: { getSystems, systemsData, isLoading },
  } = useStores();

  useEffect(() => {
    async function asyncGetLamps() {
      await getLamps();
    }

    async function asyncGetGroups() {
      await getGroups();
    }

    async function asyncGetSystems() {
      await getSystems();
    }

    asyncGetLamps();
    asyncGetGroups();
    asyncGetSystems();
  }, []);

  const handleOpenSystem = (id: string): void => {
    navigate(`/charts/systems/${id}`);
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
              <Col key={system.id} span={6}>
                <Card
                  onClick={() => handleOpenSystem(system.id)}
                  hoverable
                  title={system.name}
                  bordered={false}
                  style={{ marginBottom: 20, marginRight: 12 }}
                >
                  <p>Id: {system.id}</p>
                  <p>Groups: {system.groups_info.length}</p>
                  <p>Total Devices: {system.total_devices}</p>
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
