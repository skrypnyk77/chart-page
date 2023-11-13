import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const statsUrl = process.env.REACT_APP_STAT_URL;

export const statsClient = axios.create({
  baseURL: statsUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401) {
//       if (originalRequest._retry) {
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       console.log("axios", axios);

//       return axios
//         .post("token/refresh", {})
//         .then((res) => {
//           console.log("res", res);
//           console.log("originalRequest", originalRequest);

//           if (res.status >= 200 && res.status < 300) {
//             return axios(originalRequest);
//           }
//         })
//         .catch((error) => console.log(error));
//     }
//   }
// );

// admin
// Qwerty123
