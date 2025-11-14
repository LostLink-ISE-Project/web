import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useEffect } from "react";
import { useMe } from "@/api/auth/hook";

export default function WithAuth() {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  // Only run useMe if token exists
  const { data, isLoading, isError } = useMe({
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data) setUser(data);
    if (isError) logout();
  }, [data, isError, setUser, logout]);

  if (!token) return <Navigate to="/" replace />;
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Logging in...</p>
      </div>
    );
  }

  return <Outlet />;
}