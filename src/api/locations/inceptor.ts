import axios from "axios";

const locationInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/locations`,
  withCredentials: true,
});

locationInterceptor.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default locationInterceptor;
