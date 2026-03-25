import axios from "axios";
import { getAuthInstance } from "./firebase.service";

type RetriableRequestConfig = {
  _retry?: boolean;
  headers?: Record<string, string>;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const auth = getAuthInstance();
  const currentUser = auth.currentUser;

  if (currentUser) {
    const freshToken = await currentUser.getIdToken();
    localStorage.setItem("token", freshToken);
    config.headers.Authorization = `Bearer ${freshToken}`;
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as RetriableRequestConfig | undefined;

    if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const auth = getAuthInstance();
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const refreshedToken = await currentUser.getIdToken(true);
          localStorage.setItem("token", refreshedToken);
          originalRequest.headers = {
            ...(originalRequest.headers ?? {}),
            Authorization: `Bearer ${refreshedToken}`,
          };

          return api.request(originalRequest);
        } catch {
          // Fall through to session cleanup when token refresh fails.
        }
      }
    }

    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("uuid");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
