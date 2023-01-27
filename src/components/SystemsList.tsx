import React from "react";
import { useStores } from "../use-stores";
import { observer } from "mobx-react";

import { Card, Layout, Typography, Row, Col } from "antd";

const { Title, Text } = Typography;

const SystemsList = observer(() => {
  const {
    systemsStore: { systemsData },
  } = useStores();

  return (
    <Layout>
      <Title style={{ marginBottom: "24px" }} level={2}>
        Systems
      </Title>
      <Row>
        {systemsData?.map((system) => {
          return (
            <Col span={6}>
              <Card
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
    </Layout>
  );
});

export default SystemsList;
