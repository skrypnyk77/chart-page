import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      return axios.post("/api/token/refresh", {}).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          return axios(originalRequest);
        }
      });
    }
  }
);

// admin
// Qwerty123
