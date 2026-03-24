import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Scale,
  Ruler,
  Target,
  ChevronLeft,
  Settings2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/slices/userApiSlice";
import { setUserInfo } from "../slices/userSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { data: profileData, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      weight: "",
      height: "",
      goal: "General",
      targets: "",
    },
  });

  useEffect(() => {
    const source = profileData || userInfo;
    if (source) {
      reset({
        name: source.name || "",
        email: source.email || "",
        password: "",
        weight: source.weight || "",
        height: source.height || "",
        goal: source.goal || "General",
        targets: source.targets || "",
      });
    }
  }, [profileData, userInfo, reset]);

  const onSubmit = async (data) => {
    try {
      const updated = await updateProfile(data).unwrap();
      dispatch(setUserInfo(updated));
      toast.success("Profile updated!");
      reset({ ...data, password: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <span className="font-black uppercase tracking-widest text-xs">
          Syncing Profile
        </span>
      </div>
    );

  return (
    <>
      {/* Header Area */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <Settings2 className="h-6 w-6" />
          <h2 className="text-4xl font-black tracking-tight">Profile</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-10">
        {/* Account Section */}
        <section className="space-y-6">
          <p className="text-2xl font-black tracking-tighter border-b border-zinc-100 dark:border-zinc-900 pb-2">
            Account
          </p>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-sm tracking-tighter font-bold text-zinc-800 flex items-center gap-1">
                <User className="h-3 w-3" /> Full Name
              </Label>
              <Input
                {...register("name", { required: "Name is required" })}
                className="bg-zinc-50 dark:bg-zinc-900 border-none font-bold text-lg h-12 focus-visible:ring-black dark:focus-visible:ring-white"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm tracking-tighter font-bold text-zinc-800 flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address
              </Label>
              <Input
                disabled
                {...register("email")}
                className="bg-zinc-100/50 dark:bg-zinc-900/50 border-none font-bold text-lg h-12 opacity-60"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm tracking-tighter font-bold text-zinc-800 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Password
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="bg-zinc-50 dark:bg-zinc-900 border-none font-bold text-lg h-12 focus-visible:ring-black"
              />
            </div>
          </div>
        </section>

        {/* Biometrics Section */}
        <section className="space-y-6">
          <p className="text-2xl font-black tracking-tighter border-b border-zinc-100 dark:border-zinc-900 pb-2">
            Biometrics
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1">
                <Scale className="h-3 w-3" /> Weight (kg)
              </Label>
              <Input
                type="number"
                {...register("weight", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                className="bg-zinc-50 dark:bg-zinc-900 border-none font-bold text-lg h-12"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1">
                <Ruler className="h-3 w-3" /> Height (cm)
              </Label>
              <Input
                type="number"
                {...register("height", {
                  setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                })}
                className="bg-zinc-50 dark:bg-zinc-900 border-none font-bold text-lg h-12"
              />
            </div>
          </div>
        </section>

        {/* Goal Section */}
        <section className="space-y-6">
          <p className="text-2xl font-black tracking-tighter border-b border-zinc-100 dark:border-zinc-900 pb-2">
            Objective
          </p>

          <div className="grid gap-2">
            <Label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1">
              <Target className="h-3 w-3" /> Current Goal
            </Label>
            <select
              {...register("goal")}
              className="flex h-12 w-full rounded-md bg-zinc-50 dark:bg-zinc-900 px-3 py-1 font-bold text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            >
              <option value="Strength">Strength</option>
              <option value="Hypertrophy">Hypertrophy</option>
              <option value="Endurance">Endurance</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1">
              <Target className="h-3 w-3" /> Specific Targets
            </Label>
            <textarea
              {...register("targets")}
              placeholder="e.g. 100kg Bench, 5km under 20 mins..."
              className="flex min-h-[100px] w-full rounded-md bg-zinc-50 dark:bg-zinc-900 px-3 py-3 font-medium text-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white border-none"
            />
          </div>
        </section>

        {/* Submit Area */}
        <div className="pt-8">
          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full py-8 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xl shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : "SAVE CHANGES"}
          </Button>
        </div>
      </form>
    </>
  );
}
