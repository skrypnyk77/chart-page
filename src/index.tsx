import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import { Provider, observer } from "mobx-react";

import { useStores } from "./use-stores";
import store from "./stores";

import "antd/dist/antd.css";

// import { DeviceAvailability } from "./components/charts/DeviceAvailability";
// import { LampOperation } from "./components/charts/LampOperation";
import { TotalIlluminationTime } from "./components/charts/TotalIlluminationTime";

import { Layout } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = observer(() => {
  const {
    groupsStore: { getGroups },
    lampsStore: { getLamps },
    systemsStore: { getSystems },
    userStore: { login },
  } = useStores();

  useEffect(() => {
    async function asyncLogin() {
      await login({
        login: "admin",
        password: "Qwerty123",
      });
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

    asyncLogin();
    asyncGetLamps();
    asyncGetGroups();
    asyncGetSystems();
  }, []);

  return (
    <Layout style={{ padding: "20px" }}>
      {/* <DeviceAvailability />
      <LampOperation /> */}
      <TotalIlluminationTime />
    </Layout>
  );
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
