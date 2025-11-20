import { useAuthStore } from '@/lib/stores/auth.store';
import axios from 'axios';

let isLoggingOut = false; // prevent multiple redirects on burst errors

function logoutAndRedirect() {
  if (isLoggingOut) return;
  isLoggingOut = true;

  // Clear Zustand + localStorage in one place
  useAuthStore.getState().logout();

  // Only redirect if we're not already on the login page
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

const authInterceptor = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  withCredentials: true,
});

authInterceptor.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authInterceptor.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Network/timeout errors won’t have response
    if (!status) {
      return Promise.reject(error);
    }

    if (status === 401 || status === 403) {
      // Requirement: on 403, remove tokens so user isn’t shown as authed
      logoutAndRedirect();
    }

    return Promise.reject(error);
  }
);

export default authInterceptor;