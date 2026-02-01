import axios from "axios";
import config from "../config.json";

const api = axios.create({
  baseURL: config.backendUrl + "/api"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  Promise.reject
);

api.interceptors.response.use(
  r => r,
  e => {
    if (e.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(e);
  }
);

export default api;
