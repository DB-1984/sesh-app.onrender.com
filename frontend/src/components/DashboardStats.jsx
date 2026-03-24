import { Link, useOutletContext, useNavigate } from "react-router-dom";
import {
  Scale,
  Activity,
  ArrowRight,
  LayoutDashboard,
  UserPen,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logoutUser } from "../slices/userSlice";
import { apiSlice } from "../slices/apiSlice";
import { useLogoutMutation } from "../slices/userApiSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardStats() {
  const { profile, profileLoading } = useOutletContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutApiCall().unwrap();
    dispatch(resetMode());
    dispatch(logoutUser());
    dispatch(apiSlice.util.resetApiState());
    navigate("/");
  };

  const goalText = profileLoading ? "…" : profile?.goal || "General";
  const weightText = profileLoading
    ? "…"
    : profile?.weight
    ? `${profile.weight}kg`
    : "—";
  const bmiText = profileLoading ? "…" : profile?.bmi || "—";
  const targetsText =
    profile?.targets || "No targets set. Update your profile to add some.";

  return (
    <div className="flex flex-col min-h-full gap-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </div>
          <h2 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>

      {/* OBJECTIVE*/}
      <Card className="bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="-mb-4 font-bold pt-2">
            Current objective
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-md tracking-tight pt-2">{goalText}</p>
          <p className="mt-1 pb-2 text-sm text-muted-foreground">
            This helps shape your training focus and targets.
          </p>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Scale className="h-3.5 w-3.5" />
              Body weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">
              {weightText}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep it consistent, not perfect.
            </p>
          </CardContent>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-foreground/10" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="h-3.5 w-3.5" />
              BMI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{bmiText}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              A rough guide, not the whole story.
            </p>
          </CardContent>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-foreground/10" />
        </Card>
      </div>

      {/* TARGETS — dark */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="-mb-4 font-bold py-3">Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed pb-2 text-muted-foreground">
            {targetsText}
          </p>
        </CardContent>
      </Card>

      {/* QUICK ACTIONS — dark */}
      <Card className="mt-auto bg-muted/40text-foreground">
        <CardHeader className="py-3">
          <CardTitle className="-mb-5 font-bold">Quick actions</CardTitle>
        </CardHeader>

        <Separator className="bg-border" />

        <CardContent className="p-2 space-y-6">
          {/* Update Health Data */}
          <Button
            asChild
            variant="ghost"
            className="group w-full justify-between rounded-xl px-4 py-6 hover:bg-muted/70"
          >
            <Link to="profile" className="no-underline">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/70 border">
                  <UserPen className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                </div>

                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">
                    Update health data
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Weight, goals, targets and more
                  </div>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
            </Link>
          </Button>

          {/* Log Out */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="group w-full justify-between rounded-xl px-4 py-6 hover:bg-destructive/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/70 border">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>

              <div className="text-left">
                <div className="text-sm font-medium text-destructive">
                  Log out
                </div>
                <div className="text-xs text-muted-foreground">
                  End this session on this device
                </div>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
