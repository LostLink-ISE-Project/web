import axios from "axios";

const officeInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/offices`,
  withCredentials: true,
});

officeInterceptor.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default officeInterceptor;