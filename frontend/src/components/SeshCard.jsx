import { format } from "date-fns";
import { Trash2, ChevronRight, Clock, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const SeshCard = ({ sesh, onDelete }) => {
  const date = new Date(sesh.date);

  return (
    <Card className="group relative overflow-hidden border border-border bg-muted/30 hover:bg-muted/50 transition-all hover:shadow-lg hover:-translate-y-[2px]">
      {/* Left Accent Line */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-foreground/10 group-hover:bg-foreground transition-colors" />

      <div className="flex items-center justify-between p-2">
        <Link
          to={`/users/sesh/${sesh._id}`}
          className="flex flex-1 items-center pl-2 gap-4 no-underline"
        >
          {/* Date Block — now darker */}
          <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-foreground text-background shadow-sm transition-all group-hover:scale-105">
            <span className="text-[10px] uppercase tracking-wider opacity-80">
              {format(date, "MMM")}
            </span>
            <span className="text-lg font-semibold leading-none">
              {format(date, "dd")}
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-semibold tracking-tight text-foreground truncate">
              {sesh.title || "Untitled Sesh"}
            </h3>

            <div className="mt-1 flex items-center gap-4 text-sm text-foreground/70">
              <span className="flex items-center gap-1.5">
                <Dumbbell className="h-3.5 w-3.5" />
                {sesh.exercises?.length || 0} exercise(s)
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {format(date, "p")}
              </span>

              <span className="flex items-center gap-1.5">
                {sesh.exercises?.[0]?.comments}
              </span>
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(sesh._id)}
            className="text-foreground/50 hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <ChevronRight className="h-4 w-4 text-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-foreground" />
        </div>
      </div>
    </Card>
  );
};
