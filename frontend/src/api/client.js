import axios from "axios";

export const API_URL = "http://localhost:8080/api";
export const WS_URL = "ws://localhost:8080/ws";

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});