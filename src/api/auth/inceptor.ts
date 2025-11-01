import axios from "axios";

const authInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  withCredentials: true,
});

export default authInterceptor;