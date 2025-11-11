import axios from "axios";

const reportInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/report`,
  withCredentials: true,
});

reportInterceptor.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default reportInterceptor;
