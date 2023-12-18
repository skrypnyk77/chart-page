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

// admin
// Qwerty123
