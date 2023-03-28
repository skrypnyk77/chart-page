import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { Provider, observer } from "mobx-react";

import { useStores } from "./use-stores";
import store from "./stores";

import "antd/dist/antd.css";

import Auth from "./components/auth/Auth";
import SystemsList from "./components/SystemsList";
import SingleSystem from "./components/SingleSystem";
import Sidebar from "./components/Sidebar";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = observer(() => {
  const {
    userStore: { isLogged },
  } = useStores();

  return (
    <div
      style={{ background: "#f0f2f5", display: "flex", position: "relative", paddingLeft: 122 }}
    >
      <BrowserRouter>
        {isLogged && <Sidebar />}

        <Routes>
          {!isLogged ? (
            <>
              <Route path="*" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Auth />} />
            </>
          ) : (
            <>
              <Route path="/systems" element={<SystemsList />} />
              <Route path="/systems/:id" element={<SingleSystem />} />
              <Route path="*" element={<Navigate to="/systems" replace />} />
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
