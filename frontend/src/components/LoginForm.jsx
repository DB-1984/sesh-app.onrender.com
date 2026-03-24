import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/slices/userSlice";
import { useLoginMutation } from "@/slices/userApiSlice";
import { GoogleIcon } from "./ui/googleIcon";

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading }] = useLoginMutation();

  const handleGoogleLogin = () => {
    // Use the environment to decide the base URL
    const backendBaseUrl =
      import.meta.env.MODE === "development" ? "http://localhost:5000" : ""; // Empty string means use the current origin (Production)

    window.location.href = `${backendBaseUrl}/auth/google`;
  };

  const submitHandler = async (data) => {
    try {
      const user = await login(data).unwrap();
      dispatch(setUserInfo(user));

      toast.success("Welcome back!", {
        delay: 100, // Gives react-toastify a tick to mount/render
      });

      setTimeout(() => {
        navigate("/users/dashboard");
      }, 200); // Ensures toast renders before redirect
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.data?.message || "Invalid email or password", {
        autoClose: 3000,
      });
    }
  };

  return (
    <section className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-card p-6">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-5"
        >
          {/* Logo + Title + Tagline */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="logo-text flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white text-2xl font-bold">
                S
              </span>
              <h1 className="text-2xl logo-text tracking-tight">Log in</h1>
            </div>
            <p className="mt-1 text-muted-foreground text-sm">
              Track your training. Build consistency. One sesh at a time.
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email required" })}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold text-muted-foreground"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Password required" })}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="
              mt-2 w-full gap-2
              transition-all duration-200 ease-out
              hover:-translate-y-0.5 hover:shadow-md
              active:translate-y-0 active:shadow-sm
              disabled:pointer-events-none disabled:opacity-70
            "
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Signing you in…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                Log in
              </span>
            )}
          </Button>

          <p className="pt-2 text-center pb-2 text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a
              href="/users/register"
              className="font-medium underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </form>
        <button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full mt-3 text-sm shadow-sm flex items-center justify-center gap-3 h-11 border border-zinc-200 bg-white hover:bg-zinc-50 transition-all font-medium rounded-lg text-zinc-700"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>
    </section>
  );
}
