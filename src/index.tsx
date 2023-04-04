import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { Provider, observer } from "mobx-react";

import { useStores } from "./use-stores";
import store from "./stores";

import "antd/dist/antd.css";

import Auth from "./components/auth/Auth";
import SystemsList from "./components/SystemsList";
import UsersList from "./components/UsersList";
import SingleSystem from "./components/SingleSystem";
import Sidebar from "./components/Sidebar";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = observer(() => {
  const {
    userStore: { isLogged },
  } = useStores();

  return (
    <div
      style={{
        background: "#f0f2f5",
        display: "flex",
        position: "relative",
        paddingLeft: 122,
      }}
    >
      <BrowserRouter>
        {isLogged && <Sidebar />}

        <Routes>
          {!isLogged ? (
            <>
              <Route path="*" element={<Navigate to="/charts/login" replace />} />
              <Route path="/charts/login" element={<Auth />} />
            </>
          ) : (
            <>
              <Route path="/charts/systems" element={<SystemsList />} />
              <Route path="/charts/systems/:id" element={<SingleSystem />} />
              <Route path="*" element={<Navigate to="/charts/systems" replace />} />
              <Route path="/charts/users" element={<UsersList />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
