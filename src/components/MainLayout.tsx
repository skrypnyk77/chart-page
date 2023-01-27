import React, { useEffect } from "react";
import { useStores } from "../use-stores";
import { observer } from "mobx-react";

import SystemsList from "../components/SystemsList";
import { BatteryLevel } from "../components/charts/BatteryLevel";
import { Temperature } from "../components/charts/Temperature";

import { Layout } from "antd";

const MainLayout = observer(() => {
  const {
    groupsStore: { getGroups },
    lampsStore: { getLamps },
    systemsStore: { getSystems },
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

  return (
    <Layout style={{ padding: "20px" }}>
      <SystemsList />
      {/* <BatteryLevel />
      <br />
      <br />
      <Temperature /> */}
    </Layout>
  );
});

export default MainLayout;
