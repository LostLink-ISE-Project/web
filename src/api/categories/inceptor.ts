import axios from "axios";

const categoryInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/categories`,
  withCredentials: true,
});

categoryInterceptor.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default categoryInterceptor;