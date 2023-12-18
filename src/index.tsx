import React from "react";
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
import { useEffect } from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = observer(() => {
  const {
    userStore: { isLogged, isAdmin, login },
  } = useStores();

  // useEffect(() => {
  //   async function checkLogin() {
  //     const token = localStorage.getItem("token");
  
  //     if (token) {
  //       const decodedToken = jwtDecode(token);
    
  //       console.log("decodedToken", decodedToken);
  //       // console.log("refreshToken", decodedRefreshToken);

  //       // await login({
  //       //   login: "admin",
  //       //   password: "Qwerty123",
  //       // });
  //     }
  //   }

  //   checkLogin();
  // }, []);

  return (
    <div
      style={{
        background: "#f0f2f5",
        display: "flex",
        position: "relative",
        paddingLeft: 220,
      }}
    >
      <BrowserRouter>
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
              <Route path="/charts/dashboard" element={<SystemsList />} />
              <Route path="/charts/profile" element={<Profile />} />
              <Route path="/charts/dashboard/:id" element={<SingleSystem />} />
              <Route
                path="*"
                element={<Navigate to="/charts/dashboard" replace />}
              />
              {isAdmin && (
                <Route path="/charts/users" element={<UsersList />} />
              )}
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
