import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "../slices/userApiSlice";
import { setUserInfo } from "../slices/userSlice";
import { toast } from "react-toastify";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Trigger the 'getProfile' query.
  // Because 'credentials: include' is in baseQuery,
  // the browser sends the 'jwt' cookie automatically.
  const { data, isSuccess, isError, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (isSuccess && data) {
      // 1. Sync Redux
      dispatch(setUserInfo(data));

      // 2. Logic for the Toast
      if (data.isNewUser) {
        toast.success("Welcome to Sesh!");
      } else {
        toast.success(`Welcome back, ${data.name}!`);
      }

      // 3. Move to Dashboard
      // Using { replace: true } prevents them from "going back" to this loading screen
      navigate("/users/dashboard", { replace: true });
    }

    if (isError) {
      navigate("/users/login?error=oauth_sync_failed");
    }
  }, [isSuccess, isError, data, navigate, dispatch]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <h2 className="text-xl font-semibold">Completing Secure Login...</h2>
      <p className="text-muted-foreground">Syncing your Google profile.</p>
    </div>
  );
}
