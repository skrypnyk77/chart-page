import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { Provider, observer } from "mobx-react";

import { useStores } from "./use-stores";
import store from "./stores";

import "antd/dist/antd.css";

import Auth from "./components/auth/Auth";
import SystemsList from "./components/SystemsList";
import UsersList from "./components/UsersList";
import SingleSystem from "./components/SingleSystem";
import Profile from "./components/Profile";
import Sidebar from "./components/Sidebar";

const root = ReactDOM.createRoot(document.getElementById("root"));

const RouterComponent = observer(() => {
  const {
    userStore: { isLogged, isAdmin, updateUserLogged },
  } = useStores();

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem("token");

      if (token) {
        updateUserLogged(true);
      }
    }

    checkLogin();
  }, []);

  return (
    <div
      style={{
        background: "#f0f2f5",
        display: "flex",
        position: "relative",
        paddingLeft: 220,
      }}
    >
      <>
        {isLogged && <Sidebar />}

        <Routes>
          {!isLogged ? (
            <>
              <Route
                path="*"
                element={<Navigate to="/charts/login" replace />}
              />
              <Route path="/charts/login" element={<Auth />} />
            </>
          ) : (
            <>
              <Route
                path="*"
                element={<Navigate to="/charts/dashboard" replace />}
              />
              <Route path="/charts/dashboard" element={<SystemsList />} />
              <Route path="/charts/profile" element={<Profile />} />
              <Route path="/charts/dashboard/:id" element={<SingleSystem />} />
              {isAdmin && (
                <Route path="/charts/users" element={<UsersList />} />
              )}
            </>
          )}
        </Routes>
      </>
    </div>
  );
});

function App() {
  return (
    <BrowserRouter>
      <RouterComponent />
    </BrowserRouter>
  );
}

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
