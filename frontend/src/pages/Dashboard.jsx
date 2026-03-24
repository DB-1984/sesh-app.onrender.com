import { useNavigate, Outlet, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Loader2, History, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { SeshCard } from "@/components/SeshCard";

import {
  useAddSeshMutation,
  useGetSeshesQuery,
  useDeleteSeshMutation,
} from "../slices/seshApiSlice";
import { useGetProfileQuery } from "../slices/userApiSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { userInfo } = useSelector((state) => state.user);

  // date param from Header calendar
  const dateParam = searchParams.get("date"); // "yyyy-MM-dd" or null
  const isFiltering = !!dateParam;

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();

  // Use the filtered query when dateParam exists (matches API)
  const { data: allSeshes = [], isLoading: seshesLoading } = useGetSeshesQuery(
    { userId: userInfo?._id, date: dateParam || undefined },
    { skip: !userInfo?._id }
  );

  const displaySeshes = isFiltering ? allSeshes : allSeshes.slice(0, 5);

  const [addSesh, { isLoading: addSeshLoading }] = useAddSeshMutation();
  const [deleteSesh] = useDeleteSeshMutation();

  const handleAddSesh = async () => {
    try {
      const newSesh = await addSesh({
        title: "New Sesh",
        date: new Date().toISOString(),
        exercises: [],
      }).unwrap();
      toast.success("Sesh created!");
      navigate(`/users/sesh/${newSesh._id}`);
    } catch {
      toast.error("Failed to create sesh");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSesh(id).unwrap();
      toast.success("Sesh deleted!");
    } catch {
      toast.error("Failed to delete Sesh");
    }
  };

  const titleText = isFiltering
    ? format(new Date(`${dateParam}T00:00:00`), "EEEE, MMM d")
    : "Recent sessions";

  const subtitleText = isFiltering
    ? "Showing all sessions for this date."
    : "Showing your 5 most recent sessions.";

  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[420px_1fr] bg-transparent">
      {/* LEFT PANEL */}
      <div className="border-r bg-muted/20">
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          <div className="mx-auto w-full max-w-lg p-6 md:p-10">
            <Outlet context={{ profile, profileLoading }} />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 border-b bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between gap-4 p-6 md:p-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <History className="h-4 w-4" />
                <span className="truncate">Your activity</span>
              </div>

              <h2 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
                {titleText}
              </h2>
            </div>

            <Button
              onClick={handleAddSesh}
              disabled={addSeshLoading}
              className="gap-2 logo-text tracking-tight"
            >
              {addSeshLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New sesh
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-base pt-2 font-semibold">
                {isFiltering ? "Sessions" : "Latest sessions"}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {subtitleText}
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-64px-220px)]">
                <div className="p-6 space-y-4">
                  {seshesLoading ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : displaySeshes.length === 0 ? (
                    <div className="py-16 text-center">
                      <p className="text-sm font-medium">
                        {isFiltering
                          ? "No sessions on this date."
                          : "No recent sessions found."}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isFiltering
                          ? "Try another date, or create a new sesh."
                          : "Create your first sesh to start tracking."}
                      </p>
                      <div className="mt-5 flex justify-center">
                        <Button
                          onClick={handleAddSesh}
                          disabled={addSeshLoading}
                          className="gap-2"
                        >
                          {addSeshLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          New sesh
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {displaySeshes.map((sesh) => (
                        <SeshCard
                          key={sesh._id}
                          sesh={sesh}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
