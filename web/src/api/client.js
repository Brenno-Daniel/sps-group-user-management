import axios from "axios";

const baseURL = process.env.REACT_APP_SERVER_URL || "";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = String(err.config?.url || "");
    const isLogin = url.includes("/api/auth/login");
    if (err.response?.status === 401 && !isLogin) {
      window.dispatchEvent(new CustomEvent("sps-auth-unauthorized"));
    }
    return Promise.reject(err);
  },
);
