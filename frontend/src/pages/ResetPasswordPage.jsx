import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useResetPasswordMutation } from "@/slices/userApiSlice";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const [resetPassword, { isLoading, isSuccess, isError }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (!token) setLocalError("That reset link is missing a token.");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!token) return setLocalError("That reset link is invalid.");
    if (newPassword.length < 8) return setLocalError("Password is too short.");
    if (newPassword !== confirmPassword)
      return setLocalError("Passwords do not match.");

    try {
      await resetPassword({ token, password: newPassword }).unwrap();
      // After success, send them to login
      navigate("/users/login");
    } catch (err) {
      // Keep generic
      setLocalError("That link may have expired. Please request a new one.");
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center app-bg p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <span className="text-4xl font-bold logo-text animate-bounce">
          Sesh
        </span>

        <div className="w-full bg-background p-6 shadow-lg rounded-lg">
          <form
            onSubmit={handleSubmit}
            className="flex space-y-4 flex-col gap-4"
          >
            <h2 className="text-xl font-semibold text-center">
              Choose a new password
            </h2>

            <input
              type="password"
              placeholder="New password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full mt-3 text-sm shadow-sm flex items-center justify-center gap-3 h-11 border border-zinc-200 bg-black text-white transition-all font-medium rounded-lg"
            >
              {isLoading ? "Saving..." : "Reset password"}
            </button>

            {localError && (
              <p className="text-sm text-center text-destructive">
                {localError}
              </p>
            )}

            {isSuccess && (
              <p className="text-sm text-center text-muted-foreground">
                Password updated. Redirecting…
              </p>
            )}

            {isError && !localError && (
              <p className="text-sm text-center text-destructive">
                Something went wrong. Try again.
              </p>
            )}

            <div className="text-sm text-center">
              <Link to="/users/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
