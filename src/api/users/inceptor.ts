import axios from "axios";

const userInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/users`,
  withCredentials: true,
});

userInterceptor.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default userInterceptor;
