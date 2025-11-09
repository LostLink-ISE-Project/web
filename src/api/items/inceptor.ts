import axios from "axios";

const itemInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/items`,
  withCredentials: true,
});

itemInterceptor.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default itemInterceptor;
