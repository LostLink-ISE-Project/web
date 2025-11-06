import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useEffect } from "react";
import { useMe } from "@/api/auth/hook";

export default function WithAuth() {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (data) setUser(data);
    if (isError) logout();
  }, [data, isError]);


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
}