import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../slices/userApiSlice";
import { Loader2 } from "lucide-react";

export default function PrivateRoute() {
  // 1. Check if we *think* we are logged in locally (from Redux)
  const { userInfo: localUser } = useSelector((state) => state.user);

  // 2. Only hit the server if we have a local user record
  // This prevents the "401 Unauthorized" noise on the console after logout
  const { data: serverUser, isLoading } = useGetProfileQuery(undefined, {
    skip: !localUser,
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="flex items-end gap-1 h-8">
          <div className="w-1.5 h-4 bg-foreground/70 animate-[bounce_1s_infinite]" />
          <div className="w-1.5 h-6 bg-foreground/70 animate-[bounce_1s_infinite_0.1s]" />
          <div className="w-1.5 h-8 bg-foreground/70 animate-[bounce_1s_infinite_0.2s]" />
          <div className="w-1.5 h-6 bg-foreground/70 animate-[bounce_1s_infinite_0.3s]" />
          <div className="w-1.5 h-4 bg-foreground/70 animate-[bounce_1s_infinite_0.4s]" />
        </div>
      </div>
    );
  }

  // 3. If we have a local user AND the server confirmed it, show the page
  // Otherwise, kick them back to login
  return localUser && serverUser ? (
    <Outlet />
  ) : (
    <Navigate to="/users/login" replace />
  );
}
