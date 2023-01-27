import React from "react";
import ReactDOM from "react-dom/client";

import { Provider, observer } from "mobx-react";

import { useStores } from "./use-stores";
import store from "./stores";

import "antd/dist/antd.css";

import Auth from "./components/auth/Auth";
import MainLayout from "./components/MainLayout";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = observer(() => {
  const {
    userStore: { isLogged },
  } = useStores();

  return isLogged ? <MainLayout /> : <Auth />;
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
