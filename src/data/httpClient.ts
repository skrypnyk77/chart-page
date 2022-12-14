import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");

export const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});
