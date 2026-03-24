import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetSeshesQuery,
  useAddExerciseMutation,
  useDeleteExerciseMutation,
  useRenameSeshMutation,
  useEditExerciseMutation,
} from "../slices/seshApiSlice";
import { ExerciseForm } from "@/components/ExerciseForm";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Dumbbell,
  History,
  Clock,
  ChevronRight,
  Edit,
  Trash2,
  CalendarIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function ViewSesh() {
  const { id, exerciseId } = useParams();
  const navigate = useNavigate();

  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery();
  const currentSesh = seshes.find((s) => s._id === id);

  const exerciseToEdit = currentSesh?.exercises?.find(
    (ex) => ex._id === exerciseId
  );

  const onFormComplete = () => {
    if (exerciseId) navigate(`/users/sesh/${id}`);
  };

  const [addExercise] = useAddExerciseMutation();
  const [deleteExercise] = useDeleteExerciseMutation();
  const [renameSesh] = useRenameSeshMutation();
  const [editExercise] = useEditExerciseMutation();

  const originalTitleRef = useRef("");
  const [titleDraft, setTitleDraft] = useState("");

  useEffect(() => {
    if (currentSesh?.title) setTitleDraft(currentSesh.title);
  }, [currentSesh?._id, currentSesh?.title]);

  useEffect(() => {
    if (isError) toast.error("Failed to load session");
  }, [isError]);

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

  if (!currentSesh)
    return <div className="p-10 text-center">Sesh not found.</div>;

  const handleDeleteExercise = async (exercise) => {
    try {
      await deleteExercise({ seshId: currentSesh._id, exercise }).unwrap();
      toast.success("Exercise deleted!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete exercise");
    }
  };

  const handleRename = async () => {
    const newTitle = titleDraft.trim();
    const oldTitle = originalTitleRef.current?.trim() || currentSesh.title;

    if (!newTitle || newTitle === oldTitle) return;

    try {
      await renameSesh({ id: currentSesh._id, title: newTitle }).unwrap();
      toast.success("Title updated!");
    } catch {
      toast.error("Failed to save title");
      setTitleDraft(oldTitle);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2 bg-background overflow-hidden">
      {/* LEFT PANEL */}
      <div className="h-[calc(100vh-64px)] border-r bg-background">
        <ScrollArea className="h-full">
          <div className="mx-auto w-full max-w-lg p-8 space-y-6">
            {/* Sesh meta card */}
            <Card>
              <CardHeader className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground leading-none">
                      <CalendarIcon className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {new Date(currentSesh.date).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        id="sesh-title"
                        type="text"
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onFocus={() => {
                          originalTitleRef.current = titleDraft;
                        }}
                        onBlur={handleRename}
                        className="w-full bg-transparent border-none p-0 text-3xl font-black tracking-tighter focus:outline-none focus:ring-0"
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          document.getElementById("sesh-title")?.focus()
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Form card — tighter + consistent */}
            <Card className="bg-muted/20">
              <CardHeader className="py-2">
                <CardTitle className="text-base leading-none font-black tracking-tight text-xl">
                  {exerciseId ? "Edit exercise" : "Add exercise"}
                </CardTitle>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <ExerciseForm
                  title={null} // prevents double-title spacing in the form
                  submitLabel={exerciseId ? "Save Changes" : "Add to Sesh"}
                  defaultValues={
                    exerciseToEdit || {
                      exercise: "",
                      weight: "",
                      reps: "",
                      sets: "",
                      rest: "",
                      comments: "",
                    }
                  }
                  onCancel={
                    exerciseId ? () => navigate(`/users/sesh/${id}`) : null
                  }
                  onSubmit={async (data) => {
                    try {
                      if (exerciseId) {
                        await editExercise({
                          seshId: id,
                          exerciseId,
                          updatedExercise: data,
                        }).unwrap();
                        toast.success("Changes saved!");
                      } else {
                        await addExercise({
                          seshId: id,
                          exercise: data,
                        }).unwrap();
                        toast.success("Exercise added!");
                      }
                      onFormComplete();
                    } catch (err) {
                      toast.error(err?.data?.message || "Something went wrong");
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT PANEL */}
      <div className="h-[calc(100vh-64px)] bg-background">
        <div className="h-full p-8 space-y-6">
          {/* Dark header strip — compact, aligned */}
          <Card className="bg-foreground text-background border-foreground/10">
            <CardHeader className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm text-background/70 leading-none">
                    <History className="h-4 w-4 shrink-0" />
                    <span>Exercises</span>
                  </div>
                  <CardTitle className="mt-2 text-2xl leading-none">
                    Logged exercises
                  </CardTitle>
                </div>

                <div className="shrink-0 rounded-md bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-background/80">
                  {currentSesh.exercises?.length || 0} total
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* List card */}
          <Card className="flex-1">
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-64px-8rem-6rem)]">
                <div className="p-6 space-y-3">
                  {currentSesh.exercises?.length ? (
                    currentSesh.exercises.map((exercise) => (
                      <Card
                        key={exercise._id}
                        className="group transition-all hover:shadow-md hover:-translate-y-[1px]"
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Sets tile */}
                            <div className="flex flex-col items-center justify-center h-12 w-12 shrink-0 rounded-lg bg-muted border">
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
                                Sets
                              </span>
                              <span className="text-lg font-semibold leading-none">
                                {exercise.sets}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-base font-semibold tracking-tight capitalize truncate">
                                {exercise.exercise}
                              </h3>

                              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Dumbbell className="h-3.5 w-3.5" />
                                  {exercise.weight}kg × {exercise.reps}
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  {exercise.rest}s rest
                                </span>

                                <span className="flex items-center gap-1.5">
                                  {sesh.exercises?.[0]?.comments}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/users/sesh/${id}/exercise/${exercise._id}/edit`}
                            >
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteExercise(exercise)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="py-24 text-center">
                      <p className="text-sm font-bold">No exercises logged</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Add your first exercise on the left.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
