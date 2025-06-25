// utils/axiosInstance.js
import axios from 'axios'

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

// Request interceptor (optional for adding auth header)
instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 refresh
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/token`, {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        localStorage.setItem("accessToken", response.data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        return instance(originalRequest); // retry original
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        window.location.href = "/login"; // Force re-login
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
