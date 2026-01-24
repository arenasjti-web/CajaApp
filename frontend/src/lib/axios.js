import axios from "axios";
import { getConfig } from "./config";

let api = null;

export function initApi() {
  const { backendUrl } = getConfig();

  api = axios.create({
    baseURL: backendUrl + "/api"
  });

  // interceptor request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (
        token &&
        !config.url.includes("/login") &&
        !config.url.includes("/signin")
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // interceptor response
  api.interceptors.response.use(
    res => res,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }
      return Promise.reject(error);
    }
  );
}

export default api;
