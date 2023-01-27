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

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = observer(() => {
  const {
    userStore: { isLogged },
  } = useStores();

  return (
    <BrowserRouter>
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
  );
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
