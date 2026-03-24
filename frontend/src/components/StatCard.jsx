import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils"; // shadcn utility for merging classes

export function StatCard({
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  className,
}) {
  return (
    <Card
      className={cn(
        "bg-white/70 dark:bg-gray-800/80 backdrop-blur-md",
        "border-white/20 dark:border-gray-700/50 shadow-lg rounded-md",
        "flex flex-col h-full transition-all duration-200",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-sm pb-2 text-muted-foreground uppercase font-semibold">
            {title}
            {subtitle && (
              <p className="text-[11px] font-black tracking-tight text-black">
                {subtitle}
              </p>
            )}
          </CardTitle>
        </div>

        {Icon && <Icon className="h-4 w-4 text-muted-foreground/80" />}
      </CardHeader>

      <CardContent className="flex-1 text-sm">{children}</CardContent>

      {footer && (
        <CardFooter className="pt-2 border-t border-white/10 dark:border-gray-700/30 text-xs text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
