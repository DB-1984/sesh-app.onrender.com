/**
 * exercise FORM COMPONENT
 *
 * Supports both creating a new workout AND editing an existing workout.
 * Pre-fills fields when defaultValues change (e.g., after API load).
 */

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useGetSeshesQuery } from "../slices/seshApiSlice";

export function ExerciseForm({
  onSubmit,
  defaultValues,
  title = "Add Exercise",
  submitLabel = "Save Exercise",
  onCancel,
}) {
  // Initialize form with initial values
  const form = useForm({ defaultValues });

  // update form when defaultValues change (e.g. editing mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Removed bg-none/border-none so the form actually looks like a cohesive container */}
      <Card className="w-full border-none bg-transparent shadow-none mb-6">
        <CardContent className="flex flex-col gap-4 px-4">
          <Input
            {...form.register("exercise", { required: true })}
            placeholder="Exercise (e.g. Bench Press)"
            className="bg-white dark:bg-zinc-900"
          />

          {/* Grid for numerical values to keep the form from getting too long */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...form.register("weight", {
                required: true,
                valueAsNumber: true,
              })}
              type="number"
              placeholder="Weight (kg)"
              className="bg-white dark:bg-zinc-900"
            />
            <Input
              {...form.register("reps", {
                required: true,
                valueAsNumber: true,
              })}
              type="number"
              placeholder="Reps"
              className="bg-white dark:bg-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...form.register("sets", {
                required: true,
                valueAsNumber: true,
              })}
              type="number"
              placeholder="Sets"
              className="bg-white dark:bg-zinc-900"
            />
            <Input
              {...form.register("rest", {
                required: true,
                valueAsNumber: true,
              })}
              type="number"
              placeholder="Rest(s)"
              className="bg-white dark:bg-zinc-900"
            />
          </div>

          <Textarea
            {...form.register("comments")}
            placeholder="Notes / Comments..."
            rows={3}
            className="bg-white dark:bg-zinc-900"
          />

          {/* Action Group: Buttons are now inside the same vertical flow */}
          <div className="flex flex-col gap-2 mt-2 pt-2">
            <Button type="submit" className="w-full font-bold py-6">
              {submitLabel}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="w-full text-zinc-500 hover:text-black pt-2 dark:hover:text-white underline py-6 font-normal"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
