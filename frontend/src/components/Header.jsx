import { useRef, useState, useEffect, useMemo } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { setMode } from "../slices/modeSlice";
import { useGetSeshesQuery } from "../slices/seshApiSlice";

export default function Header() {
  const { userInfo } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.mode);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Only show calendar on dashboard
  const isDashboard = location.pathname === "/users/dashboard";
  const showCalendar = isDashboard;

  // Back button visibility
  const isAtRoot = /^\/users\/(dashboard)?\/?$/.test(location.pathname);
  const showBack = !isAtRoot;

  // Date comes from URL param when on dashboard
  const dateParam = isDashboard ? searchParams.get("date") : null; // "yyyy-MM-dd"
  const selectedDate = dateParam ? new Date(`${dateParam}T00:00:00`) : null;

  // Fetch seshes for date markers (calendar underline/border)
  const { data: seshes = [] } = useGetSeshesQuery(
    { userId: userInfo?._id },
    { skip: !userInfo?._id }
  );

  // Set() lets the calendar instantly know which days contain sessions, efficiently.
  const seshDaySet = useMemo(() => {
    return new Set(seshes.map((s) => format(new Date(s.date), "yyyy-MM-dd")));
  }, [seshes]);

  const setDateParam = (d) => {
    if (!isDashboard) return;

    const next = new URLSearchParams(searchParams);

    if (d) {
      next.set("date", format(d, "yyyy-MM-dd"));
    } else {
      next.delete("date");
    }

    setSearchParams(next, { replace: true });
  };

  const handleBack = () => {
    // Clear date filter whenever leaving a subpage
    if (isDashboard) setDateParam(null);
    navigate("/users/dashboard", { replace: true });
  };

  const handleClear = () => {
    setDateParam(null);
    navigate("/users/dashboard");
  };

  // Theme sync
  useEffect(() => {
    const root = document.documentElement;
    mode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [mode]);

  // Dynamic header height
  useEffect(() => {
    if (!headerRef.current) return;

    const updateHeight = () => setHeaderHeight(headerRef.current.offsetHeight);
    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(headerRef.current);

    return () => ro.disconnect();
  }, []);

  const getInitials = (name = "") =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <div className="min-h-[100dvh] bg-transparent">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm border-b"
      >
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left */}
            <div className="flex items-center justify-between md:justify-start gap-4">
              <Link to="/users/dashboard" className="flex items-center gap-3">
                <span className="logo-text text-3xl font-bold text-foreground">
                  SESH
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold hidden lg:block">
                  {userInfo?.name}
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                <Label className="text-sm font-normal">Theme</Label>
                <Switch
                  checked={mode === "dark"}
                  onCheckedChange={(checked) =>
                    dispatch(setMode(checked ? "dark" : "light"))
                  }
                  className="scale-75"
                />
              </div>

              <div className="flex items-center gap-2">
                {showBack && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBack}
                    className="h-8 text-sm gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back
                  </Button>
                )}

                {showCalendar && (
                  <div className="flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-8 text-sm gap-2"
                        >
                          <span className="hidden sm:inline">
                            {selectedDate
                              ? format(selectedDate, "MMM d")
                              : "Filter by date"}
                          </span>
                          <span className="sm:hidden">
                            {selectedDate
                              ? format(selectedDate, "MM/dd")
                              : "Date"}
                          </span>
                          <CalendarIcon className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate ?? undefined}
                          onSelect={(d) => setDateParam(d ?? null)}
                          modifiers={{
                            hasWorkout: (date) =>
                              seshDaySet.has(format(date, "yyyy-MM-dd")),
                          }}
                          modifiersClassNames={{
                            hasWorkout: "underline",
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="h-8 px-2 text-sm text-destructive"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: `${headerHeight}px` }}>
        <Outlet />
      </main>
    </div>
  );
}
